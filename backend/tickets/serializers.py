from decimal import Decimal

from rest_framework import serializers

from users.serializers import UserSerializer

from .models import Booking, Comment, Event, EventCategory


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = '__all__'


class EventListSerializer(serializers.ModelSerializer):
    category = EventCategorySerializer(read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)

    class Meta:
        model = Event
        fields = (
            'id',
            'category',
            'author_id',
            'author_name',
            'title',
            'slug',
            'description',
            'event_date',
            'city',
            'venue_name',
            'venue_address',
            'organizer_name',
            'total_tickets',
            'available_tickets',
            'price',
            'image_url',
            'status',
            'created_at',
        )


class EventWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = (
            'id',
            'category',
            'title',
            'description',
            'event_date',
            'city',
            'venue_name',
            'venue_address',
            'organizer_name',
            'total_tickets',
            'available_tickets',
            'price',
            'image_url',
            'status',
        )


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'event', 'author', 'author_name', 'text', 'rating', 'created_at', 'updated_at')
        read_only_fields = ('author',)


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id',
            'event',
            'event_title',
            'user',
            'ticket_quantity',
            'total_price',
            'contact_phone',
            'attendee_name',
            'status',
            'booked_at',
        )
        read_only_fields = ('total_price', 'status')

    def validate(self, attrs):
        event = attrs['event']
        quantity = attrs['ticket_quantity']
        if quantity <= 0:
            raise serializers.ValidationError('Количество билетов должно быть положительным.')
        if event.available_tickets < quantity:
            raise serializers.ValidationError('Недостаточно свободных билетов.')
        return attrs

    def create(self, validated_data):
        event = validated_data['event']
        quantity = validated_data['ticket_quantity']
        validated_data['total_price'] = Decimal(quantity) * event.price
        event.available_tickets -= quantity
        if event.available_tickets == 0:
            event.status = 'sold_out'
        event.save()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        new_status = validated_data.get('status', instance.status)
        if instance.status == 'active' and new_status == 'cancelled':
            instance.event.available_tickets += instance.ticket_quantity
            if instance.event.status == 'sold_out':
                instance.event.status = 'published'
            instance.event.save()
        return super().update(instance, validated_data)


class EventDetailSerializer(EventListSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(EventListSerializer.Meta):
        fields = EventListSerializer.Meta.fields + ('total_tickets', 'updated_at', 'comments')
