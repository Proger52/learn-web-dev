export default function StepIndicator() {
  return (
    <nav className="steps-nav" aria-label="Этапы записи">
      <div className="steps-container">
        {/* Шаг 1 */}
        <div className="step-item step-completed">
          <div className="step-badge">
            <span className="step-icon">✓</span>
          </div>
          <span className="step-name">Выбор мастера</span>
        </div>

        {/* Шаг 2 */}
        <div className="step-item step-completed">
          <div className="step-badge">
            <span className="step-icon">✓</span>
          </div>
          <span className="step-name">Услуга</span>
        </div>

        {/* Шаг 3: Текущий активный */}
        <div className="step-item step-active">
          <div className="step-badge">
            <span className="step-number">3</span>
          </div>
          <div className="step-text-group">
            <span className="step-counter">Шаг 3 из 5</span>
            <span className="step-name">Дата и время</span>
          </div>
        </div>

        {/* Шаг 4 */}
        <div className="step-item step-upcoming">
          <div className="step-badge">
            <span className="step-number">4</span>
          </div>
          <span className="step-name">Ваши данные</span>
        </div>

        {/* Шаг 5 */}
        <div className="step-item step-upcoming">
          <div className="step-badge">
            <span className="step-number">5</span>
          </div>
          <span className="step-name">Подтверждение</span>
        </div>
      </div>
    </nav>
  );
}
