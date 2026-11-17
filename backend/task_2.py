"""
Модуль Backend. Задание 2.
Реализация REST API эндпоинтов на FastAPI:
1. GET /categories — список всех категорий услуг со счетчиком услуг.
2. GET /categories/{category_id} — информация о конкретной категории (или 404 если не найдена).
"""

from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

app = FastAPI(title="Salon Categories API")


class Category(BaseModel):
    """Модель категории услуг."""

    id: int
    name: str
    servicesCount: int


# Исходные данные категорий из задания
categories: List[Category] = [
    Category(id=1, name="Стрижки и укладки", servicesCount=5),
    Category(id=2, name="Маникюр и педикюр", servicesCount=5),
    Category(id=3, name="Брови и ресницы", servicesCount=4),
    Category(id=4, name="Спа-процедуры", servicesCount=4),
]


@app.get(
    "/categories",
    response_model=List[Category],
    status_code=status.HTTP_200_OK,
    summary="Получить список всех категорий",
)
def get_categories() -> List[Category]:
    """
    Задание 1. Список категорий.
    Возвращает список всех категорий услуг с количеством услуг в каждой.
    """
    return categories


@app.get(
    "/categories/{category_id}",
    response_model=Category,
    status_code=status.HTTP_200_OK,
    summary="Получить информацию о конкретной категории",
    responses={
        404: {
            "description": "Category not found",
            "content": {"text/plain": {"example": "Category not found"}},
        }
    },
)
def get_category_by_id(category_id: int) -> Category:
    """
    Задание 2. Информация по категории.
    Возвращает данные о категории с кодом 200,
    либо код 404 с сообщением 'Category not found', если категория не найдена.
    """
    for category in categories:
        if category.id == category_id:
            return category

    # Если категория не найдена — выбрасываем HTTPException с кодом 404
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Category not found",
    )


# Дополнительно: обработчик для текстового ответа 404 при запросе
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request, exc: HTTPException):
    if exc.status_code == status.HTTP_404_NOT_FOUND:
        return PlainTextResponse(str(exc.detail), status_code=404)
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)


if __name__ == "__main__":
    print("=== Тестирование функций эндпоинтов напрямую ===")

    print("\n--- 1. Тест эндпоинта GET /categories ---")
    cats = get_categories()
    print("Количество категорий:", len(cats))
    for c in cats:
        print(f"[{c.id}] {c.name} (услуг: {c.servicesCount})")

    print("\n--- 2. Тест эндпоинта GET /categories/1 (существующая категория) ---")
    cat1 = get_category_by_id(1)
    print("Результат:", cat1.model_dump())

    print("\n--- 3. Тест эндпоинта GET /categories/999 (несуществующая категория) ---")
    try:
        get_category_by_id(999)
    except HTTPException as error:
        print(f"Поймано исключение: Код {error.status_code}, Сообщение: '{error.detail}'")
