from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from tickets.models import Event, EventCategory
from users.models import Profile, User


class Command(BaseCommand):
    help = 'Creates demo users, categories and events for local presentation.'

    def handle(self, *args, **options):
        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True,
            },
        )
        admin.set_password('admin12345')
        admin.save()
        Profile.objects.get_or_create(user=admin, defaults={'notification_email': admin.email})

        organizer, _ = User.objects.get_or_create(
            username='organizer',
            defaults={'email': 'organizer@example.com'},
        )
        organizer.set_password('organizer12345')
        organizer.save()
        Profile.objects.get_or_create(
            user=organizer,
            defaults={'notification_email': organizer.email, 'city': 'Ставрополь'},
        )

        categories = [
            ('Концерты', 'Живые музыкальные выступления', 'music', '#f97316', 12),
            ('Театр', 'Спектакли и постановки', 'masks', '#0f766e', 16),
            ('Спорт', 'Матчи и спортивные шоу', 'trophy', '#2563eb', 6),
        ]

        category_map = {}
        for name, description, icon, color, age_limit in categories:
            category, _ = EventCategory.objects.get_or_create(
                name=name,
                defaults={
                    'description': description,
                    'icon': icon,
                    'color': color,
                    'age_limit': age_limit,
                },
            )
            category_map[name] = category

        demo_events = [
            {
                'title': 'Симфонический вечер',
                'category': category_map['Концерты'],
                'description': 'Оркестровая программа с живым световым шоу.',
                'event_date': timezone.now() + timedelta(days=7),
                'city': 'Ставрополь',
                'venue_name': 'Филармония',
                'venue_address': 'пр. Октябрьской революции, 5',
                'organizer_name': 'Городская филармония',
                'total_tickets': 180,
                'available_tickets': 180,
                'price': '2200.00',
                'status': 'published',
            },
            {
                'title': 'Премьера спектакля "Гроза"',
                'category': category_map['Театр'],
                'description': 'Современная постановка классической пьесы.',
                'event_date': timezone.now() + timedelta(days=12),
                'city': 'Ставрополь',
                'venue_name': 'Драмтеатр',
                'venue_address': 'пл. Ленина, 1',
                'organizer_name': 'Драматический театр',
                'total_tickets': 120,
                'available_tickets': 95,
                'price': '1800.00',
                'status': 'published',
            },
        ]

        for payload in demo_events:
            Event.objects.get_or_create(
                title=payload['title'],
                defaults={**payload, 'author': organizer},
            )

        self.stdout.write(self.style.SUCCESS('Demo data created successfully.'))
