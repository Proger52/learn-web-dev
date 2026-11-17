"""
Модуль Backend. Задание 4.
Pydantic валидация и создание услуг через API в FastAPI:
1. Pydantic-модель ServiceCreate с ограничениями (title, desc, duration, price, categoryId).
2. SQLAlchemy-модель Service и сохранение в SQLite БД.
3. POST /services со статусом 201 и валидацией 422.
"""

from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, Field, ConfigDict, field_validator
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# =====================================================================
# 1. Настройка базы данных SQLite и SQLAlchemy
# =====================================================================

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = BASE_DIR / "salon.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH.as_posix()}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# =====================================================================
# 2. SQLAlchemy-модель Service
# =====================================================================

class Service(Base):
    """Модель услуги в базе данных."""

    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    categoryId = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    desc = Column(String(100), nullable=False)
    duration = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)


# Создание таблицы в БД
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================================
# 3. Pydantic-модели (Задание 1)
# =====================================================================

class ServiceCreate(BaseModel):
    """
    Pydantic-модель создания услуги со строгими ограничениями:
    - categoryId: идентификатор категории;
    - title: не пустое, макс 100 символов;
    - desc: не пустое, макс 100 символов;
    - duration: от 30 минут до 180 минут (3 часа);
    - price: строго больше 0.
    """

    categoryId: int = Field(..., description="ID категории услуги", gt=0)
    title: str = Field(..., min_length=1, max_length=100, description="Название услуги")
    desc: str = Field(..., min_length=1, max_length=100, description="Описание услуги")
    duration: int = Field(
        ...,
        ge=30,
        le=180,
        description="Продолжительность услуги в минутах (от 30 мин до 3 часов / 180 мин)",
    )
    price: float = Field(..., gt=0, description="Стоимость услуги (строго больше 0)")

    @field_validator("title", "desc")
    @classmethod
    def validate_not_empty_whitespace(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Поле не может быть пустым или состоять только из пробелов")
        return v.strip()


class ServiceResponse(ServiceCreate):
    """Схема ответа созданной услуги."""

    model_config = ConfigDict(from_attributes=True)
    id: int


# =====================================================================
# 4. FastAPI эндпоинт (Задание 2)
# =====================================================================

app = FastAPI(title="Salon Services API")


@app.post(
    "/services",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новую услугу",
)
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
) -> Service:
    """
    Создаёт новую услугу в БД после успешной валидации через ServiceCreate.
    Возвращает созданную запись с HTTP статусом 201 Created.
    При неверных данных FastAPI автоматически возвращает 422 Unprocessable Entity.
    """
    new_service = Service(
        categoryId=service_in.categoryId,
        title=service_in.title,
        desc=service_in.desc,
        duration=service_in.duration,
        price=service_in.price,
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service


# =====================================================================
# Прямая проверка без сетевых запросов
# =====================================================================
if __name__ == "__main__":
    from pydantic import ValidationError

    print("=== Проверка Задания 4 (Pydantic-валидация и POST /services) ===")

    db = SessionLocal()
    try:
        # 1. Корректный запрос
        print("\n--- Тест 1: Корректные данные ---")
        payload1 = {
            "categoryId": 3,
            "title": "Наращивание ресниц",
            "desc": "Огромные ресницы уже через 30 минут",
            "duration": 30,
            "price": 1500.00,
        }
        service_data = ServiceCreate(**payload1)
        created = create_service(service_data, db=db)
        print(f"Результат: Успешно создана услуга с id={created.id}, статус 201")
        print(
            f"Запись в БД: title='{created.title}', desc='{created.desc}', "
            f"duration={created.duration}, price={created.price}, categoryId={created.categoryId}"
        )

        # 2. Некорректный запрос: price = "бесплатно"
        print("\n--- Тест 2: price = 'бесплатно' (ожидается ошибка 422) ---")
        payload2 = {
            "categoryId": 3,
            "title": "Наращивание ресниц",
            "desc": "Огромные ресницы уже через 30 минут",
            "duration": 30,
            "price": "бесплатно",
        }
        try:
            ServiceCreate(**payload2)
            print("Ошибка: валидация должна была упасть!")
        except ValidationError as err:
            print("Результат: Ошибка валидации с кодом 422 (ValidationError поймана):")
            print(err.errors()[0]["msg"])

        # 3. Некорректный запрос: пустой desc, duration = 0, price = -1500.00
        print("\n--- Тест 3: desc='', duration=0, price=-1500.00 (ожидается ошибка 422) ---")
        payload3 = {
            "categoryId": 3,
            "title": "Наращивание ресниц",
            "desc": "",
            "duration": 0,
            "price": -1500.00,
        }
        try:
            ServiceCreate(**payload3)
            print("Ошибка: валидация должна была упасть!")
        except ValidationError as err:
            print("Результат: Ошибка валидации с кодом 422 (ValidationError поймана):")
            for error in err.errors():
                print(f" - Поле '{error['loc'][0]}': {error['msg']}")

    finally:
        db.close()
