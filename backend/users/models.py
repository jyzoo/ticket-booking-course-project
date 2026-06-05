from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)

    class Meta:
        verbose_name = 'пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    city = models.CharField(max_length=120, blank=True)
    preferred_event_type = models.CharField(max_length=120, blank=True)
    notification_email = models.EmailField(blank=True)
    about = models.TextField(blank=True)

    class Meta:
        verbose_name = 'профиль'
        verbose_name_plural = 'Профили'

    def __str__(self):
        return f'Профиль: {self.user.username}'
