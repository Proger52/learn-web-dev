import { DAYS_OF_WEEK, MONTHS_GENITIVE } from "../utils/date";

export default function BookingBottomBar({
  selectedDay,
  selectedMonth,
  selectedYear,
  selectedTime,
  onNext,
  onBack,
}) {
  const dateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[selectedMonth];

  const timePart = selectedTime ? ` • ${selectedTime}` : " • время не выбрано";

  return (
    <section className="action-bar" aria-label="Панель перехода">
      <button type="button" className="btn btn-outline btn-back" onClick={onBack}>
        ← Назад
      </button>

      <div className="action-summary">
        <div className="summary-datetime">
          {dayName}, {selectedDay} {monthName} {selectedYear}
          {timePart}
        </div>
        <div className="summary-meta">90 минут &nbsp;·&nbsp; 2 800 ₽</div>
      </div>

      <button
        type="button"
        className="btn btn-gold btn-next"
        onClick={onNext}
        disabled={!selectedTime}
      >
        Далее →
      </button>
    </section>
  );
}
