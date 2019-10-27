from django.urls import path, include
from . import views

from rest_framework.routers import SimpleRouter

from geojourney.views.journey import JourneyViewSet

urlpatterns = []

router = SimpleRouter()
router.register("journey", JourneyViewSet, basename="journey")

urlpatterns += router.urls
