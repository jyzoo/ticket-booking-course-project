import { useEffect, useState } from 'react';

import { api } from '../modules/auth/api';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings/').then((response) => setBookings(response.data.results ?? response.data));
  }, []);

  return (
    <section className="stack">
      <h2>Мои бронирования</h2>
      <div className="stack">
        {bookings.map((booking) => (
          <article className="panel booking-card" key={booking.id}>
            <h3>{booking.event_title}</h3>
            <p>Количество: {booking.ticket_quantity}</p>
            <p>Сумма: {Number(booking.total_price).toLocaleString('ru-RU')} ₽</p>
            <p>Статус: {booking.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
