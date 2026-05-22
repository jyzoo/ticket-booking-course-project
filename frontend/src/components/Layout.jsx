import { Link, NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../modules/auth/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__backdrop" />
        <div className="hero__content">
          <Link className="brand" to="/">
            Афиша+
          </Link>
          <nav className="nav">
            <NavLink to="/">Афиша</NavLink>
            {user && <NavLink to="/bookings">Мои брони</NavLink>}
            {user && <NavLink to="/manage-events">Мои события</NavLink>}
            {user?.is_staff && <NavLink to="/manage-categories">Категории</NavLink>}
            {user ? (
              <>
                <NavLink to="/profile">Профиль</NavLink>
                <button className="ghost-button" onClick={logout} type="button">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Вход</NavLink>
                <NavLink to="/register">Регистрация</NavLink>
              </>
            )}
          </nav>
          <div className="hero__text">
            <p className="eyebrow">Афиша и билеты на лучшие события</p>
            <h1>Откройте для себя концерты, спектакли и мероприятия рядом с вами</h1>
            <p>
              Бронируйте билеты за несколько минут, отслеживайте свои заказы и
              получайте доступ к актуальной афише событий в одном месте.
            </p>
          </div>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
