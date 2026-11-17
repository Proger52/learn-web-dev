export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          {/* Колонка бренда */}
          <div className="footer-col brand-col">
            <div className="footer-brand-title">BLACKWOOD</div>
            <div className="footer-brand-sub">BARBERSHOP</div>
            <p className="footer-tagline">Твой стиль — наша работа.</p>
          </div>

          {/* Колонка навигации */}
          <div className="footer-col nav-col">
            <div className="footer-heading">НАВИГАЦИЯ</div>
            <ul className="footer-nav-list">
              <li>
                <a href="#">Главная</a>
                <span className="nav-dot">·</span>
                <a href="#">Услуги</a>
                <span className="nav-dot">·</span>
                <a href="#">Мастера</a>
              </li>
              <li>
                <a href="#">Отзывы</a>
                <span className="nav-dot">·</span>
                <a href="#">Контакты</a>
              </li>
            </ul>
          </div>

          {/* Колонка информации */}
          <div className="footer-col info-col">
            <div className="footer-heading">ЖДЁМ ВАС В BLACKWOOD</div>
            <p className="footer-info-text">
              Выберите удобное время
              <br />
              и доверьте свой стиль мастеру.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">© BLACKWOOD BARBERSHOP, 2026</div>
          <div className="footer-signature">Создано с характером</div>
        </div>
      </div>
    </footer>
  );
}
