import { MONTHS_NOMINATIVE } from "../utils/date";

export default function CalendarHeader({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
}) {
  return (
    <div className="calendar-header">
      <h2 id="calendar-title" className="calendar-month">
        {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
      </h2>
      <div className="calendar-controls">
        <button
          type="button"
          className="calendar-arrow"
          aria-label="Предыдущий месяц"
          onClick={onPrevMonth}
        >
          ‹
        </button>
        <button
          type="button"
          className="calendar-arrow"
          aria-label="Следующий месяц"
          onClick={onNextMonth}
        >
          ›
        </button>
      </div>
    </div>
  );
}
