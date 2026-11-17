"""
Модуль Backend. Задание 3.
SQLAlchemy и FastAPI:
1. Модель Master и таблица masters в SQLite БД (id, name, specialization).
2. GET /masters — список мастеров (с поддержкой фильтра ?specialization=...).
3. GET /masters/{master_id} — мастер по id (или 404).
"""

from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import create_engine, Column, Integer, String
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
# 2. Модель Master (Задание 1)
# =====================================================================

class Master(Base):
    """
    SQLAlchemy-модель мастера салона.
    Таблица masters содержит минимум три поля: id, name, specialization.
    """
    __tablename__ = "masters"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)


# Создание таблицы в БД
Base.metadata.create_all(bind=engine)


def init_db():
    """Начальное заполнение базы тестовыми данными из задания."""
    db = SessionLocal()
    try:
        if db.query(Master).count() == 0:
            initial_masters = [
                Master(id=1, name="Анна", specialization="Парикмахер"),
                Master(id=2, name="Мария", specialization="Визажист"),
            ]
            db.add_all(initial_masters)
            db.commit()
    finally:
        db.close()


init_db()


# Dependency для получения сессии базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================================
# 3. Pydantic-схемы
# =====================================================================

class MasterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    specialization: str


# =====================================================================
# 4. FastAPI приложение и эндпоинты (Задание 2)
# =====================================================================

app = FastAPI(title="Salon Masters API")


@app.get(
    "/masters",
    response_model=List[MasterResponse],
    status_code=status.HTTP_200_OK,
    summary="Получить список мастеров (с фильтрацией по специализации)",
)
def get_masters(
    specialization: Optional[str] = Query(None, description="Фильтр по специализации"),
    db: Session = Depends(get_db),
) -> List[MasterResponse]:
    """
    1. GET /masters — получить список всех мастеров из БД.
    2. GET /masters?specialization=Парикмахер — получить только мастеров указанной специализации.
    """
    query = db.query(Master)
    if specialization:
        query = query.filter(Master.specialization == specialization)
    return query.all()


@app.get(
    "/masters/{master_id}",
    response_model=MasterResponse,
    status_code=status.HTTP_200_OK,
    summary="Получить мастера по id",
)
def get_master_by_id(
    master_id: int,
    db: Session = Depends(get_db),
) -> MasterResponse:
    """
    3. GET /masters/{master_id} — получить одного мастера по его id из БД.
    Если мастер не найден — вернуть 404 Not Found.
    """
    master = db.query(Master).filter(Master.id == master_id).first()
    if not master:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Master not found",
        )
    return master


# =====================================================================
# Прямая проверка без сетевых запросов
# =====================================================================
if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("=== Проверка работы с базой данных SQLite через SQLAlchemy ===")

        print("\n--- 1. Тест GET /masters (все мастера) ---")
        all_m = get_masters(specialization=None, db=db)
        for m in all_m:
            print(f"[{m.id}] {m.name} — {m.specialization}")

        print("\n--- 2. Тест GET /masters?specialization=Парикмахер ---")
        filtered_m = get_masters(specialization="Парикмахер", db=db)
        for m in filtered_m:
            print(f"[{m.id}] {m.name} — {m.specialization}")

        print("\n--- 3. Тест GET /masters/1 (существующий id) ---")
        m1 = get_master_by_id(master_id=1, db=db)
        print(f"Найден: id={m1.id}, name='{m1.name}', specialization='{m1.specialization}'")

        print("\n--- 4. Тест GET /masters/999 (несуществующий id) ---")
        try:
            get_master_by_id(master_id=999, db=db)
        except HTTPException as e:
            print(f"Ожидаемая ошибка 404: {e.status_code} — {e.detail}")

    finally:
        db.close()
