// ============================================================
// 1. ДАННЫЕ С СЕРВЕРА (ИМИТАЦИЯ)
// ============================================================

// «Сегодня» — актуальная текущая дата пользователя через new Date()
const _now = new Date();
const SERVER_DATA = {
  today: {
    day: _now.getDate(),
    month: _now.getMonth(),
    year: _now.getFullYear(),
  },
  slots: [],
};

// Разные слоты для чётных и нечётных дней, чтобы видеть смену данных
const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "11:30", available: false },
  { time: "13:00", available: true },
  { time: "14:30", available: true },
  { time: "16:00", available: true },
  { time: "17:30", available: false },
  { time: "19:00", available: true },
];

const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "11:30", available: true },
  { time: "13:00", available: false },
  { time: "14:30", available: true },
  { time: "16:00", available: false },
  { time: "17:30", available: true },
  { time: "19:00", available: false },
];

// Получение слотов для конкретного дня
function getSlotsForDay(day, month, year) {
  const isEven = day % 2 === 0;
  const slots = isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return { day: day, month: month, year: year, slots: slots };
}

// ============================================================
// 2. СОСТОЯНИЕ СТРАНИЦЫ (STATE)
// ============================================================

// Начальное состояние: актуальный текущий месяц и доступный сегодняшний день
const BOOKING_STATE = {
  currentMonth: SERVER_DATA.today.month,
  currentYear: SERVER_DATA.today.year,
  selectedDay: SERVER_DATA.today.day,
  selectedTime: null,
};

// ============================================================
// 3. ЧИСТЫЕ ФУНКЦИИ И КОНСТАНТЫ
// ============================================================

const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

// Сравнение двух дат { day, month, year }
function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// Проверка: можно ли выбрать дату (не раньше сегодняшнего дня)
function isDateSelectable(day, month, year) {
  const today = SERVER_DATA.today;
  return compareDates({ day: day, month: month, year: year }, today) >= 0;
}

// Построение сетки календаря
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Сдвиг (0 = вс -> 6, 1 = пн -> 0)
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const cells = [];

  // Дни предыдущего месяца
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  // Дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  // Дни следующего месяца
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  return cells;
}

// ============================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================================

// Отрисовка календаря
function renderCalendar() {
  const monthTitle = document.getElementById("calendar-title");
  const calendarDays = document.getElementById("calendar-days");

  const year = BOOKING_STATE.currentYear;
  const month = BOOKING_STATE.currentMonth;

  // Обновляем заголовок: "Ноябрь 2026"
  if (monthTitle) {
    monthTitle.textContent = MONTHS_NOMINATIVE[month] + " " + year;
  }

  if (!calendarDays) return;

  const cells = buildCalendarGrid(year, month);
  const today = SERVER_DATA.today;

  let html = "";
  cells.forEach(function (cell) {
    let classes = "day-btn";
    let extraAttrs = "";

    if (cell.otherMonth) {
      classes += " other-month";
      extraAttrs = ' disabled aria-disabled="true"';
    } else {
      const isToday =
        cell.day === today.day &&
        month === today.month &&
        year === today.year;
      if (isToday) classes += " today";

      const isSelected =
        cell.day === BOOKING_STATE.selectedDay &&
        month === BOOKING_STATE.currentMonth &&
        year === BOOKING_STATE.currentYear;
      if (isSelected) classes += " selected";

      const selectable = isDateSelectable(cell.day, month, year);
      if (!selectable) {
        classes += " disabled";
        extraAttrs = ' disabled aria-disabled="true"';
      }
    }

    html +=
      '<button type="button" class="' +
      classes +
      '" data-day="' +
      cell.day +
      '" data-other="' +
      cell.otherMonth +
      '"' +
      extraAttrs +
      ">" +
      cell.day +
      "</button>";
  });

  calendarDays.innerHTML = html;

  // Навешиваем обработчики на кликабельные дни
  const activeDayButtons = calendarDays.querySelectorAll(
    ".day-btn:not(.other-month):not(.disabled)"
  );

  activeDayButtons.forEach(function (btn) {
    btn.addEventListener("click", onDayClick);
  });
}

// Клик по дню
function onDayClick(event) {
  const btn = event.currentTarget;
  const day = parseInt(btn.dataset.day, 10);

  BOOKING_STATE.selectedDay = day;
  // Сбрасываем выбранное время при переходе на другой день
  BOOKING_STATE.selectedTime = null;

  // Получаем слоты для нового дня
  const response = getSlotsForDay(
    day,
    BOOKING_STATE.currentMonth,
    BOOKING_STATE.currentYear
  );
  SERVER_DATA.slots = response.slots;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  updateNextButtonState();
}

// Отрисовка слотов времени
function renderTimeSlots() {
  const timeGrid = document.getElementById("time-slots-grid");
  if (!timeGrid) return;

  const slots = SERVER_DATA.slots;

  if (!slots || slots.length === 0) {
    timeGrid.innerHTML =
      '<div style="grid-column: 1 / -1; text-align: center; padding: 24px 0; color: #777777;">Нет свободных слотов на этот день</div>';
    return;
  }

  let html = "";
  slots.forEach(function (slot) {
    let classes = "time-slot-btn";
    let statusText = "";

    if (!slot.available) {
      classes += " disabled";
      statusText = '<span class="time-slot-status">Занято</span>';
    } else if (slot.time === BOOKING_STATE.selectedTime) {
      classes += " selected";
      statusText = '<span class="time-slot-status">Выбрано</span>';
    } else {
      classes += " available";
    }

    html +=
      '<button type="button" class="' +
      classes +
      '" data-time="' +
      slot.time +
      '"' +
      (!slot.available ? " disabled" : "") +
      ">" +
      '<span class="time-slot-value">' +
      slot.time +
      "</span>" +
      statusText +
      "</button>";
  });

  timeGrid.innerHTML = html;

  // Навешиваем обработчики только на доступные слоты
  const availableSlots = timeGrid.querySelectorAll(".time-slot-btn.available, .time-slot-btn.selected");
  availableSlots.forEach(function (slotBtn) {
    slotBtn.addEventListener("click", onTimeSlotClick);
  });
}

// Клик по слоту времени
function onTimeSlotClick(event) {
  const slotBtn = event.currentTarget;
  const time = slotBtn.dataset.time;

  BOOKING_STATE.selectedTime = time;

  renderTimeSlots();
  updateBottomBar();
  updateNextButtonState();
}

// Обновление нижней панели с выбранной датой и временем
function updateBottomBar() {
  const datetimeEl = document.getElementById("summary-datetime");
  if (!datetimeEl) return;

  const day = BOOKING_STATE.selectedDay;
  const month = BOOKING_STATE.currentMonth;
  const year = BOOKING_STATE.currentYear;

  const isDayValid =
    day !== null && isDateSelectable(day, month, year);

  if (!isDayValid) {
    datetimeEl.textContent = "Дата не выбрана или недоступна";
    return;
  }

  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];

  const timePart = BOOKING_STATE.selectedTime
    ? " • " + BOOKING_STATE.selectedTime
    : " • время не выбрано";

  datetimeEl.textContent = dayName + ", " + day + " " + monthName + " " + year + timePart;
}

// Управление активностью кнопки «Далее»
function updateNextButtonState() {
  const nextBtn = document.getElementById("btn-next");
  if (!nextBtn) return;

  const isDayValid =
    BOOKING_STATE.selectedDay !== null &&
    isDateSelectable(
      BOOKING_STATE.selectedDay,
      BOOKING_STATE.currentMonth,
      BOOKING_STATE.currentYear
    );
  const isTimeValid = Boolean(BOOKING_STATE.selectedTime);

  const canProceed = isDayValid && isTimeValid;

  if (canProceed) {
    nextBtn.removeAttribute("disabled");
    nextBtn.classList.remove("disabled");
  } else {
    nextBtn.setAttribute("disabled", "disabled");
    nextBtn.classList.add("disabled");
  }
}

// Навигация по месяцам («‹» и «›») с полной синхронизацией
function setupMonthNavigation() {
  const prevBtn = document.getElementById("calendar-prev");
  const nextBtn = document.getElementById("calendar-next");

  function changeMonth(delta) {
    BOOKING_STATE.currentMonth += delta;
    if (BOOKING_STATE.currentMonth < 0) {
      BOOKING_STATE.currentMonth = 11;
      BOOKING_STATE.currentYear -= 1;
    } else if (BOOKING_STATE.currentMonth > 11) {
      BOOKING_STATE.currentMonth = 0;
      BOOKING_STATE.currentYear += 1;
    }

    // Синхронизация выбора при смене месяца:
    const isCurrentMonth =
      BOOKING_STATE.currentYear === SERVER_DATA.today.year &&
      BOOKING_STATE.currentMonth === SERVER_DATA.today.month;

    const isFutureMonth =
      compareDates(
        { day: 1, month: BOOKING_STATE.currentMonth, year: BOOKING_STATE.currentYear },
        SERVER_DATA.today
      ) > 0;

    if (isCurrentMonth) {
      // В текущем месяце выбираем сегодня
      BOOKING_STATE.selectedDay = SERVER_DATA.today.day;
    } else if (isFutureMonth) {
      // В будущем месяце выбираем 1-е число
      BOOKING_STATE.selectedDay = 1;
    } else {
      // В прошлом месяце все даты недоступны
      BOOKING_STATE.selectedDay = null;
    }

    // Сбрасываем выбранное время
    BOOKING_STATE.selectedTime = null;

    // Синхронизируем слоты для нового дня
    if (BOOKING_STATE.selectedDay !== null) {
      const response = getSlotsForDay(
        BOOKING_STATE.selectedDay,
        BOOKING_STATE.currentMonth,
        BOOKING_STATE.currentYear
      );
      SERVER_DATA.slots = response.slots;
      const firstAvailable = SERVER_DATA.slots.find(function (s) {
        return s.available;
      });
      if (firstAvailable) {
        BOOKING_STATE.selectedTime = firstAvailable.time;
      }
    } else {
      SERVER_DATA.slots = [];
    }

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
    updateNextButtonState();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      changeMonth(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      changeMonth(1);
    });
  }
}

// Кнопка «Далее» с проверкой допустимости даты и времени
function setupNextButton() {
  const nextBtn = document.getElementById("btn-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      const isDayValid =
        BOOKING_STATE.selectedDay !== null &&
        isDateSelectable(
          BOOKING_STATE.selectedDay,
          BOOKING_STATE.currentMonth,
          BOOKING_STATE.currentYear
        );

      if (!isDayValid) {
        alert("Пожалуйста, выберите доступную дату для записи.");
        return;
      }

      if (!BOOKING_STATE.selectedTime) {
        alert("Пожалуйста, выберите удобное время для записи.");
        return;
      }

      const bookingInfo = {
        day: BOOKING_STATE.selectedDay,
        month: BOOKING_STATE.currentMonth,
        year: BOOKING_STATE.currentYear,
        time: BOOKING_STATE.selectedTime,
      };

      try {
        localStorage.setItem("blackwood-booking", JSON.stringify(bookingInfo));
      } catch (e) {
        console.error("Ошибка сохранения в localStorage:", e);
      }

      alert(
        "Вы успешно выбрали запись на: " +
          BOOKING_STATE.selectedDay +
          " " +
          MONTHS_GENITIVE[BOOKING_STATE.currentMonth] +
          " " +
          BOOKING_STATE.currentYear +
          ", время " +
          BOOKING_STATE.selectedTime
      );
    });
  }
}

// ============================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// ============================================================

function init() {
  // Загружаем слоты для сегодняшнего доступного дня
  const response = getSlotsForDay(
    BOOKING_STATE.selectedDay,
    BOOKING_STATE.currentMonth,
    BOOKING_STATE.currentYear
  );
  SERVER_DATA.slots = response.slots;

  // Инициализируем первым доступным слотом
  const firstAvailableSlot = SERVER_DATA.slots.find(function (slot) {
    return slot.available;
  });
  if (firstAvailableSlot) {
    BOOKING_STATE.selectedTime = firstAvailableSlot.time;
  }

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
  setupNextButton();
  updateNextButtonState();
}

// Запуск после готовности DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
