import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

export default function Calendar({
  currentMonth,
  currentYear,
  selectedDay,
  today,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}) {
  return (
    <section className="card calendar-card" aria-labelledby="calendar-title">
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
      <CalendarGrid
        currentMonth={currentMonth}
        currentYear={currentYear}
        selectedDay={selectedDay}
        today={today}
        onSelectDay={onSelectDay}
      />
    </section>
  );
}
