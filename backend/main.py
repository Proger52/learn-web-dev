"""
Модуль Backend. Задание 1 и Задание 2.
- Класс Appointment (запись клиента)
- Валидация заполненности всех полей
- Бизнес-правило: часы работы салона с 08:00 до 20:00 включительно
"""

from typing import Optional


class Master:
    """Класс мастера салона."""

    def __init__(self, master_id: int, name: str):
        self.master_id = master_id
        self.name = name

    def __repr__(self) -> str:
        return f"Master(id={self.master_id}, name='{self.name}')"


class Service:
    """Класс услуги салона."""

    def __init__(self, service_id: int, name: str, price: int):
        self.service_id = service_id
        self.name = name
        self.price = price

    def __repr__(self) -> str:
        return f"Service(id={self.service_id}, name='{self.name}', price={self.price})"


class Appointment:
    """
    Класс записи клиента на услугу к мастеру.
    """

    def __init__(
        self,
        id: int,
        client_name: str,
        master_id: int,
        service_id: int,
        time: str,
    ):
        self.id = id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

    def __repr__(self) -> str:
        return (
            f"Appointment(id={self.id}, client_name='{self.client_name}', "
            f"master_id={self.master_id}, service_id={self.service_id}, time='{self.time}')"
        )


# Имитация базы данных мастеров и услуг
masters = [
    Master(master_id=1, name="Дмитрий Волков"),
    Master(master_id=2, name="Алексей Иванов"),
]

services = [
    Service(service_id=1, name="Стрижка + оформление бороды", price=2800),
    Service(service_id=2, name="Мужская стрижка", price=1800),
]

# Список всех подтверждённых записей
appointments: list[Appointment] = []


def get_master(master_id: int) -> Optional[Master]:
    """Поиск мастера по id."""
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Optional[Service]:
    """Поиск услуги по id."""
    for service in services:
        if service.service_id == service_id:
            return service
    return None


def is_valid_working_time(time_str: str) -> bool:
    """
    Проверка бизнес-правила:
    Записаться к мастеру можно только в часы работы салона: с 08:00 до 20:00 включительно.
    Время 20:00 допустимо (последний слот), 20:30 и позже — нет.
    """
    try:
        parts = time_str.strip().split(":")
        if len(parts) != 2:
            return False
        hours = int(parts[0])
        minutes = int(parts[1])
        if not (0 <= minutes < 60):
            return False
        # Рабочие часы с 08:00 до 20:00 включительно (20:30 и позже недопустимо)
        return 8 <= hours <= 20 and (hours < 20 or minutes == 0)
    except (ValueError, AttributeError):
        return False


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Optional[Appointment]:
    """
    Создаёт объект класса Appointment и добавляет его в список appointments.
    Объект создаётся только если:
    1. Заполнены все поля (не пустые).
    2. Найдены мастер и услуга.
    3. Время попадает в интервал работы салона (с 08:00 до 20:00).
    """
    # 1. Проверка заполненности всех полей
    if not client_name or not str(client_name).strip():
        return None
    if not master_id or not service_id:
        return None
    if not time or not str(time).strip():
        return None

    # 2. Проверка бизнес-правила: часы работы с 08:00 до 20:00 включительно
    if not is_valid_working_time(time):
        return None

    # 3. Проверка существования мастера и услуги
    master = get_master(master_id)
    service = get_service(service_id)

    if master is None or service is None:
        return None

    # 4. Создание объекта класса Appointment
    appointment = Appointment(
        id=len(appointments) + 1,
        client_name=client_name.strip(),
        master_id=master.master_id,
        service_id=service.service_id,
        time=time.strip(),
    )

    appointments.append(appointment)
    return appointment


# =====================================================================
# Тестирование решения по сценариям из задания
# =====================================================================
if __name__ == "__main__":
    print("--- Тест 1: Создание 2 корректных записей ---")
    appointments.clear()
    first_appointment = create_appointment("Иванова А.А.", 1, 1, "10:00")
    second_appointment = create_appointment("Петрова А.А.", 1, 1, "11:00")

    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    print("\n--- Тест 2: Запись с незаполненным именем клиента ---")
    appointments.clear()
    no_correct_appointment = create_appointment("", 1, 1, "12:00")
    print(len(appointments))  # Ожидается: 0

    print("\n--- Тест 3: Запись с некорректным временем (00:00) ---")
    appointments.clear()
    no_correct_appointment = create_appointment("Сидорова А.А.", 1, 1, "00:00")
    print(len(appointments))  # Ожидается: 0

    print("\n--- Тест 4: Запись на 20:00 (граничное допустимое время) ---")
    appointments.clear()
    last_slot_appointment = create_appointment("Козлов В.В.", 1, 1, "20:00")
    print(len(appointments))  # Ожидается: 1 (запись на 20:00 допускается)
    if last_slot_appointment:
        print(last_slot_appointment.client_name, last_slot_appointment.time)

    print("\n--- Тест 5: Запись на 20:30 (недопустимо — после закрытия) ---")
    appointments.clear()
    after_close_appointment = create_appointment("Новиков П.П.", 1, 1, "20:30")
    print(len(appointments))  # Ожидается: 0
