import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { api } from '../modules/auth/api';
import { useAuth } from '../modules/auth/AuthContext';

export function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [bookingForm, setBookingForm] = useState({
    ticket_quantity: 1,
    contact_phone: '',
    attendee_name: '',
  });

  useEffect(() => {
    api.get(`/events/${id}/`).then((response) => setEvent(response.data));
  }, [id]);

  async function createBooking(submitEvent) {
    submitEvent.preventDefault();
    await api.post('/bookings/', { ...bookingForm, event: Number(id) });
    const response = await api.get(`/events/${id}/`);
    setEvent(response.data);
    setBookingForm({ ticket_quantity: 1, contact_phone: '', attendee_name: '' });
  }

  async function createComment(submitEvent) {
    submitEvent.preventDefault();
    await api.post('/comments/', { event: Number(id), text: commentText, rating: 5 });
    const response = await api.get(`/events/${id}/`);
    setEvent(response.data);
    setCommentText('');
  }

  if (!event) {
    return <p className="page-state">Загружаем событие...</p>;
  }

  return (
    <section className="detail-layout">
      <article className="panel detail-card">
        <span className="pill">{event.category.name}</span>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <div className="detail-grid">
          <div>
            <strong>Дата</strong>
            <p>{new Date(event.event_date).toLocaleString('ru-RU')}</p>
          </div>
          <div>
            <strong>Локация</strong>
            <p>
              {event.city}, {event.venue_name}
            </p>
          </div>
          <div>
            <strong>Адрес</strong>
            <p>{event.venue_address}</p>
          </div>
          <div>
            <strong>Свободно мест</strong>
            <p>{event.available_tickets}</p>
          </div>
        </div>
      </article>

      <aside className="stack">
        <div className="panel">
          <h3>{Number(event.price).toLocaleString('ru-RU')} ₽</h3>
          <p className="muted">Организатор: {event.organizer_name}</p>
          {user ? (
            <form className="stack" onSubmit={createBooking}>
              <input
                className="input"
                min="1"
                max={event.available_tickets}
                type="number"
                value={bookingForm.ticket_quantity}
                onChange={(submitEvent) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    ticket_quantity: Number(submitEvent.target.value),
                  }))
                }
              />
              <input
                className="input"
                placeholder="Телефон"
                value={bookingForm.contact_phone}
                onChange={(submitEvent) =>
                  setBookingForm((prev) => ({ ...prev, contact_phone: submitEvent.target.value }))
                }
              />
              <input
                className="input"
                placeholder="Имя посетителя"
                value={bookingForm.attendee_name}
                onChange={(submitEvent) =>
                  setBookingForm((prev) => ({ ...prev, attendee_name: submitEvent.target.value }))
                }
              />
              <button className="primary-button" type="submit">
                Забронировать
              </button>
            </form>
          ) : (
            <p className="muted">Войдите, чтобы бронировать билеты и оставлять комментарии.</p>
          )}
        </div>

        <div className="panel stack">
          <h3>Комментарии</h3>
          {user && (
            <form className="stack" onSubmit={createComment}>
              <textarea
                className="input input--textarea"
                placeholder="Ваш комментарий"
                value={commentText}
                onChange={(submitEvent) => setCommentText(submitEvent.target.value)}
              />
              <button className="primary-button" type="submit">
                Добавить комментарий
              </button>
            </form>
          )}
          <div className="stack">
            {event.comments.map((comment) => (
              <article className="comment" key={comment.id}>
                <strong>{comment.author_name}</strong>
                <p>{comment.text}</p>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
