import { useEffect, useState } from 'react';

import { api } from '../modules/auth/api';
import { useAuth } from '../modules/auth/AuthContext';

const emptyForm = {
  category: '',
  title: '',
  description: '',
  event_date: '',
  city: '',
  venue_name: '',
  venue_address: '',
  organizer_name: '',
  total_tickets: 100,
  available_tickets: 100,
  price: 1500,
  image_url: '',
  status: 'draft',
};

export function ManageEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function loadData() {
    const [eventsResponse, categoriesResponse] = await Promise.all([
      api.get('/events/?mine=1'),
      api.get('/categories/'),
    ]);
    setEvents(eventsResponse.data.results ?? eventsResponse.data);
    setCategories(categoriesResponse.data.results ?? categoriesResponse.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      category: Number(form.category),
      total_tickets: Number(form.total_tickets),
      available_tickets: Number(form.available_tickets),
      price: Number(form.price),
    };

    if (editingId) {
      await api.put(`/events/${editingId}/`, payload);
    } else {
      await api.post('/events/', payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    await loadData();
  }

  async function handleDelete(id) {
    await api.delete(`/events/${id}/`);
    await loadData();
  }

  function startEdit(event) {
    setEditingId(event.id);
    setForm({
      category: event.category.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date.slice(0, 16),
      city: event.city,
      venue_name: event.venue_name,
      venue_address: event.venue_address,
      organizer_name: event.organizer_name,
      total_tickets: event.total_tickets ?? event.available_tickets,
      available_tickets: event.available_tickets,
      price: event.price,
      image_url: event.image_url ?? '',
      status: event.status,
    });
  }

  return (
    <section className="detail-layout">
      <form className="panel stack" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Редактирование события' : 'Новое событие'}</h2>
        <select
          className="input"
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {Object.entries({
          title: 'Название',
          city: 'Город',
          venue_name: 'Площадка',
          venue_address: 'Адрес',
          organizer_name: 'Организатор',
          event_date: 'Дата и время',
          total_tickets: 'Всего билетов',
          available_tickets: 'Доступно билетов',
          price: 'Цена',
          image_url: 'Ссылка на изображение',
        }).map(([key, label]) => (
          <input
            key={key}
            className="input"
            placeholder={label}
            type={key === 'event_date' ? 'datetime-local' : 'text'}
            value={form[key]}
            onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
          />
        ))}
        <textarea
          className="input input--textarea"
          placeholder="Описание события"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
        <select
          className="input"
          value={form.status}
          onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
        >
          <option value="draft">Черновик</option>
          <option value="published">Опубликовано</option>
          <option value="sold_out">Нет мест</option>
        </select>
        <button className="primary-button" type="submit">
          {editingId ? 'Сохранить' : 'Создать'}
        </button>
      </form>

      <div className="stack">
        <h2>Мои события</h2>
        {events.map((event) => (
          <article className="panel booking-card" key={event.id}>
            <h3>{event.title}</h3>
            <p>
              {event.city}, {event.venue_name}
            </p>
            <p>Статус: {event.status}</p>
            {user?.is_staff && <p>Автор: {event.author_name}</p>}
            <div className="actions">
              <button className="ghost-button" onClick={() => startEdit(event)} type="button">
                Редактировать
              </button>
              <button className="ghost-button" onClick={() => handleDelete(event.id)} type="button">
                Удалить
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
