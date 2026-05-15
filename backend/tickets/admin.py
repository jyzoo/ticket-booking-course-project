from django.contrib import admin

from .models import Booking, Comment, Event, EventCategory


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'age_limit', 'color')
    search_fields = ('name',)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'city', 'event_date', 'status', 'available_tickets')
    list_filter = ('status', 'category', 'city')
    search_fields = ('title', 'description', 'venue_name', 'venue_address')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'ticket_quantity', 'status', 'booked_at')
    list_filter = ('status',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('event', 'author', 'rating', 'created_at')
    search_fields = ('text', 'author__username', 'event__title')
