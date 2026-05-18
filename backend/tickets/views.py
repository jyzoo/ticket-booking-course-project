from django.db.models import Q
from rest_framework import viewsets

from .models import Booking, Comment, Event, EventCategory
from .permissions import IsAdminOrReadOnly, IsAuthorOrAdminOrReadOnly, IsBookingOwnerOrAdmin
from .serializers import (
    BookingSerializer,
    CommentSerializer,
    EventCategorySerializer,
    EventDetailSerializer,
    EventListSerializer,
    EventWriteSerializer,
)


class EventCategoryViewSet(viewsets.ModelViewSet):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ('name', 'description')


class EventViewSet(viewsets.ModelViewSet):
    search_fields = ('title', 'description', 'city', 'venue_name')
    ordering_fields = ('event_date', 'price', 'created_at')
    permission_classes = [IsAuthorOrAdminOrReadOnly]

    def get_queryset(self):
        queryset = Event.objects.select_related('category', 'author').prefetch_related('comments')
        user = self.request.user
        if user.is_staff:
            return queryset
        if user.is_authenticated and self.request.query_params.get('mine') == '1':
            return queryset.filter(author=user)
        if user.is_authenticated:
            return queryset.filter(Q(status='published') | Q(author=user)).distinct()
        return queryset.filter(status='published')

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return EventWriteSerializer
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventListSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsBookingOwnerOrAdmin]

    def get_queryset(self):
        queryset = Booking.objects.select_related('event', 'user', 'user__profile')
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrAdminOrReadOnly]
    search_fields = ('text',)

    def get_queryset(self):
        queryset = Comment.objects.select_related('author', 'event')
        event_id = self.request.query_params.get('event')
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
