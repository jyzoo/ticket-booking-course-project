import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../modules/auth/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    await login(form);
    navigate('/');
  }

  return (
    <section className="form-shell">
      <form className="panel form-card stack" onSubmit={handleSubmit}>
        <h2>Вход</h2>
        <input
          className="input"
          placeholder="Логин"
          value={form.username}
          onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
        />
        <input
          className="input"
          placeholder="Пароль"
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
        <button className="primary-button" type="submit">
          Войти
        </button>
      </form>
    </section>
  );
}
