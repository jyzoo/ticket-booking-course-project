import { useState } from 'react';

import { useAuth } from '../modules/auth/AuthContext';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState(user);

  async function handleSubmit(event) {
    event.preventDefault();
    await updateProfile(form);
  }

  return (
    <section className="form-shell">
      <form className="panel form-card stack" onSubmit={handleSubmit}>
        <h2>Профиль</h2>
        <input
          className="input"
          placeholder="Имя"
          value={form.first_name ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
        />
        <input
          className="input"
          placeholder="Фамилия"
          value={form.last_name ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
        />
        <input
          className="input"
          placeholder="Телефон"
          value={form.phone ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
        />
        <textarea
          className="input input--textarea"
          placeholder="О себе"
          value={form.bio ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
        />
        <input
          className="input"
          placeholder="Город"
          value={form.profile?.city ?? ''}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, profile: { ...prev.profile, city: event.target.value } }))
          }
        />
        <input
          className="input"
          placeholder="Предпочтительный тип события"
          value={form.profile?.preferred_event_type ?? ''}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              profile: { ...prev.profile, preferred_event_type: event.target.value },
            }))
          }
        />
        <button className="primary-button" type="submit">
          Сохранить
        </button>
      </form>
    </section>
  );
}
