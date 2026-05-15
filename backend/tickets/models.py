from decimal import Decimal
from uuid import uuid4

from django.conf import settings
from django.db import models
from django.utils.text import slugify


class EventCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, default='#1d4ed8')
    age_limit = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['name']
        verbose_name = 'категория событий'
        verbose_name_plural = 'Категории событий'

    def __str__(self):
        return self.name


class Event(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Черновик'),
        ('published', 'Опубликовано'),
        ('sold_out', 'Нет мест'),
    )

    category = models.ForeignKey(EventCategory, on_delete=models.PROTECT, related_name='events')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    event_date = models.DateTimeField()
    city = models.CharField(max_length=120)
    venue_name = models.CharField(max_length=160)
    venue_address = models.CharField(max_length=255)
    organizer_name = models.CharField(max_length=160)
    total_tickets = models.PositiveIntegerField(default=100)
    available_tickets = models.PositiveIntegerField(default=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('1500.00'))
    image_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['event_date', '-created_at']
        verbose_name = 'событие'
        verbose_name_plural = 'События'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or f'event-{uuid4().hex[:8]}'
            slug = base_slug
            suffix = 1
            while Event.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f'{base_slug}-{suffix}'
                suffix += 1
            self.slug = slug
        if self.available_tickets == 0:
            self.status = 'sold_out'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Booking(models.Model):
    STATUS_CHOICES = (
        ('active', 'Активно'),
        ('cancelled', 'Отменено'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    ticket_quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    contact_phone = models.CharField(max_length=20)
    attendee_name = models.CharField(max_length=160)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    booked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-booked_at']
        verbose_name = 'бронирование'
        verbose_name_plural = 'Бронирования'

    def __str__(self):
        return f'{self.user} -> {self.event}'


class Comment(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    rating = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'комментарий'
        verbose_name_plural = 'Комментарии'

    def __str__(self):
        return f'Комментарий {self.author} к {self.event}'
