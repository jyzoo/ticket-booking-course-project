from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from tickets.models import Booking, Event, EventCategory
from users.models import Profile, User


class TicketApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='event_author',
            password='StrongPassword123',
            email='author@example.com',
        )
        Profile.objects.create(user=self.user, notification_email='author@example.com')
        self.category = EventCategory.objects.create(
            name='Концерты',
            description='Музыкальные события',
            icon='music',
            color='#ef4444',
            age_limit=12,
        )
        self.event = Event.objects.create(
            category=self.category,
            author=self.user,
            title='Летний концерт',
            description='Большое музыкальное событие.',
            event_date=timezone.now() + timedelta(days=10),
            city='Ставрополь',
            venue_name='Дворец культуры',
            venue_address='ул. Центральная, 10',
            organizer_name='Музыкальный центр',
            total_tickets=50,
            available_tickets=50,
            price='2500.00',
            status='published',
        )

    def test_guest_can_view_event_list(self):
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_authenticated_user_can_book_ticket(self):
        login_response = self.client.post(
            reverse('login'),
            {'username': 'event_author', 'password': 'StrongPassword123'},
            format='json',
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

        response = self.client.post(
            '/api/bookings/',
            {
                'event': self.event.id,
                'ticket_quantity': 2,
                'contact_phone': '+79990001122',
                'attendee_name': 'Иван Иванов',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.event.refresh_from_db()
        self.assertEqual(self.event.available_tickets, 48)
        self.assertEqual(Booking.objects.count(), 1)
