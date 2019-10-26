import requests
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from django.conf import settings

from geojourney.serializers.journey import CreateJourneySerializer


class JourneyViewSet(ListModelMixin, CreateModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = None  # WIP
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["POST"])
    def create_journey(self, request, *args, **kwargs):  # WIP
        """
        Основной метод, должен принимать userId, city, startPoint, endPoint, duration, distance, filters и выдавать
        готовый маршрут по сути. Логику лучше описывать в сервисах
        Примерная выдача:
        [
            {
                duration,
                distance,
                places:[
                        {
                        placeId,
                        name,
                        categories: [],
                        position,
                        timeToNextPlace,
                        distanceToNextPlace
                        }
                ]
            },
            rating,
            link
        ]
        """
        # user = request.user  # скорее всего тут упадет без аутентификации
        serializer = CreateJourneySerializer(data=request.data)
        # serializer.is_valid()
        result = serializer.save()
        # надо выводить готовый вариант путешествия

        return Response(result)

    @action(detail=False, methods=["GET"])
    def categories(self, request):
        city = request.query_params['city']
        city_bounds = requests.get(f'https://geocoder.api.here.com/6.2/geocode.json'
                                   f'?app_id={settings.app_id}'
                                   f'&app_code={settings.app_code}'
                                   f'&searchtext={city}')
        city_bounds = city_bounds.json()
        topleft = city_bounds[city_bounds['Response']['View'][0]['Result'][0]['Location']['MapView']['Topleft']]
        bottomright = city_bounds['Response']['View'][0]['Result'][0]['Location']['MapView']['BottomRight']
        center = city_bounds['Response']['View'][0]['Result'][0]['Location']['DisplayPosition']

        cats = request.query_params['categories']

        categories = requests.get(f'https://places.api.here.com/places/v1/discover/explore'
                                  f'?at={center["Latitude"]},{center["Longitude"]}'
                                  f'&cat={cats}'
                                  f'&app_id={settings.app_id}'
                                  f'&app_code={settings.app_code}')
        categories = categories.json()

        return Response(categories)

    def create(self, request, *args, **kwargs):
        """По сути просто записывает новое путешествие в базу"""  # TODO: придумать в каком виде, написать сериализатор
        return super(JourneyViewSet, self).create(request, *args, **kwargs)