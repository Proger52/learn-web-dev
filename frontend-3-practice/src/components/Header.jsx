export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#" className="logo">
          <span className="logo-title">BLACKWOOD</span>
        </a>

        <nav className="main-nav" aria-label="Основное меню">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#" className="nav-link">
                Главная
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link active">
                Услуги
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Мастера
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Отзывы
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Контакты
              </a>
            </li>
          </ul>
        </nav>

        <button type="button" className="btn btn-gold btn-header">
          Записаться
        </button>
      </div>
    </header>
  );
}
