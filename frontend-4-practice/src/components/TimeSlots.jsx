export default function TimeSlots({
  slots,
  selectedTime,
  loading,
  error,
  onSelectTime,
}) {
  return (
    <section className="card time-card" aria-labelledby="time-title">
      <h2 id="time-title" className="time-card-title">
        Свободное время
      </h2>

      <div className="time-slots-grid">
        {loading ? (
          <div className="slots-message slots-loading">Загрузка слотов...</div>
        ) : error ? (
          <div className="slots-message slots-error">Ошибка: {error}</div>
        ) : slots && slots.length > 0 ? (
          slots.map((slot) => {
            let classes = "time-slot-btn";
            let statusText = null;

            if (!slot.available) {
              classes += " disabled";
              statusText = <span className="time-slot-status">Занято</span>;
            } else if (slot.time === selectedTime) {
              classes += " selected";
              statusText = <span className="time-slot-status">Выбрано</span>;
            } else {
              classes += " available";
            }

            return (
              <button
                key={slot.time}
                type="button"
                className={classes}
                disabled={!slot.available}
                onClick={() => slot.available && onSelectTime(slot.time)}
              >
                <span className="time-slot-value">{slot.time}</span>
                {statusText}
              </button>
            );
          })
        ) : (
          <div className="slots-message">В этот день нет свободных слотов</div>
        )}

        <div className="time-slots-hint">Приглушённые слоты уже заняты</div>
      </div>
    </section>
  );
}
