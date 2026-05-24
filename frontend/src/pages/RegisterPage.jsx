import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../modules/auth/AuthContext';

const initialForm = {
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  phone: '',
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(form);
      navigate('/');
    } catch (requestError) {
      const data = requestError?.response?.data;
      if (data && typeof data === 'object') {
        const messages = Object.entries(data)
          .flatMap(([field, value]) => {
            const items = Array.isArray(value) ? value : [value];
            return items.map((item) => `${field}: ${item}`);
          })
          .join(' ');
        setError(messages || 'Не удалось создать аккаунт.');
      } else {
        setError('Не удалось создать аккаунт. Проверьте введённые данные.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="form-shell">
      <form className="panel form-card stack" onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        <p className="muted">Используйте пароль минимум из 8 символов, не только цифры.</p>
        {Object.entries({
          username: 'Логин',
          email: 'Email',
          password: 'Пароль',
          first_name: 'Имя',
          last_name: 'Фамилия',
          phone: 'Телефон',
        }).map(([key, label]) => (
          <input
            key={key}
            className="input"
            placeholder={label}
            type={key === 'password' ? 'password' : 'text'}
            value={form[key]}
            onChange={(currentEvent) =>
              setForm((prev) => ({ ...prev, [key]: currentEvent.target.value }))
            }
          />
        ))}
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? 'Создание...' : 'Создать аккаунт'}
        </button>
      </form>
    </section>
  );
}
