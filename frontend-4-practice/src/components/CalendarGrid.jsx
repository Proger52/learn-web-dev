import { buildCalendarGrid, isDateSelectable } from "../utils/date";

export default function CalendarGrid({
  currentMonth,
  currentYear,
  selectedDay,
  today,
  onSelectDay,
}) {
  const cells = buildCalendarGrid(currentYear, currentMonth);

  return (
    <>
      <div className="calendar-weekdays" aria-hidden="true">
        <span>Пн</span>
        <span>Вт</span>
        <span>Ср</span>
        <span>Чт</span>
        <span>Пт</span>
        <span>Сб</span>
        <span>Вс</span>
      </div>

      <div className="calendar-days">
        {cells.map((cell, index) => {
          let classes = "day-btn";
          let isClickable = false;

          if (cell.otherMonth) {
            classes += " other-month";
          } else {
            const isToday =
              today &&
              cell.day === today.day &&
              currentMonth === today.month &&
              currentYear === today.year;
            if (isToday) classes += " today";

            const isSelected =
              cell.day === selectedDay &&
              today &&
              currentMonth === today.month &&
              currentYear === today.year;
            if (isSelected) classes += " selected";

            const selectable = isDateSelectable(
              cell.day,
              currentMonth,
              currentYear,
              today
            );
            if (!selectable) {
              classes += " disabled";
            } else {
              isClickable = true;
            }
          }

          return (
            <button
              key={`${cell.day}-${index}`}
              type="button"
              className={classes}
              disabled={!isClickable}
              onClick={() => isClickable && onSelectDay(cell.day)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </>
  );
}
