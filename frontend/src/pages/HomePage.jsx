import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../modules/auth/api';

export function HomePage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    Promise.all([api.get('/events/'), api.get('/categories/')])
      .then(([eventsResponse, categoriesResponse]) => {
        setEvents(eventsResponse.data.results ?? []);
        setCategories(categoriesResponse.data.results ?? categoriesResponse.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesQuery = [event.title, event.description, event.city]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory = !categoryId || String(event.category.id) === categoryId;
    return matchesQuery && matchesCategory;
  });

  return (
    <section className="stack">
      <div className="panel filters">
        <input
          className="input"
          placeholder="Поиск по названию, описанию или городу"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="input"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="page-state">Загружаем афишу...</p>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <article className="event-card" key={event.id}>
              <div className="event-card__top">
                <span className="pill">{event.category.name}</span>
                <span className="muted">{new Date(event.event_date).toLocaleString('ru-RU')}</span>
              </div>
              <h3>{event.title}</h3>
              <p>{event.description.slice(0, 120)}...</p>
              <div className="event-meta">
                <span>{event.city}</span>
                <span>{event.venue_name}</span>
              </div>
              <div className="event-card__bottom">
                <strong>{Number(event.price).toLocaleString('ru-RU')} ₽</strong>
                <Link className="primary-link" to={`/events/${event.id}`}>
                  Подробнее
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
