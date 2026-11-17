export default function MasterInfo() {
  return (
    <section className="master-card" aria-label="Выбранный мастер и услуга">
      <div className="master-header">
        <span className="master-label">Мастер: </span>
        <span className="master-name">Дмитрий Волков</span>
      </div>
      <div className="master-service">Услуга: Стрижка + оформление бороды</div>
      <div className="master-details">
        <span className="details-duration">Продолжительность: 90 минут</span>
        <span className="details-separator">·</span>
        <span className="details-price">Стоимость: 2 800 ₽</span>
      </div>
    </section>
  );
}
