from rest_framework.routers import DefaultRouter

from .views import BookingViewSet, CommentViewSet, EventCategoryViewSet, EventViewSet

router = DefaultRouter()
router.register('categories', EventCategoryViewSet, basename='category')
router.register('events', EventViewSet, basename='event')
router.register('bookings', BookingViewSet, basename='booking')
router.register('comments', CommentViewSet, basename='comment')

urlpatterns = router.urls
