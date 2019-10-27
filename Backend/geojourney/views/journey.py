import requests
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from django.conf import settings
from geojourney.models import Journey
from geojourney.serializers.journey import CreateJourneySerializer, JourneySerializer


class JourneyViewSet(ListModelMixin, CreateModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = JourneySerializer  # WIP

    queryset = Journey.objects.all()

    # permission_classes = (IsAuthenticated,)

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
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        # надо выводить готовый вариант путешествия

        return Response(result)

    @action(detail=False, methods=["GET"])
    def categories(self, request):
        try:
            city = request.query_params['city']
        except KeyError:
            return ValidationError("Необходим параметр: city")
        city_bounds = requests.get(f'https://geocoder.api.here.com/6.2/geocode.json'
                                   f'?app_id={settings.APP_ID}'
                                   f'&app_code={settings.APP_CODE}'
                                   f'&searchtext={city}')
        print("! received city bounds from remote API")
        city_bounds = city_bounds.json()
        center = city_bounds['Response']['View'][0]['Result'][0]['Location']['DisplayPosition']

        categories = requests.get(f'https://places.api.here.com/places/v1/categories/places'
                                  f'?at={center["Latitude"]},{center["Longitude"]}'
                                  f'&app_id={settings.APP_ID}'
                                  f'&app_code={settings.APP_CODE}')

        print("! received categories from remote API")
        categories = categories.json()
        # remove all upper-level-categories
        popped = categories
        # popped = []
        # for i in categories['items']:
        #     if len(i['within']) != 0:
        #         popped.append(i)

        return Response(popped)

    def create(self, request, *args, **kwargs):
        """По сути просто записывает новое путешествие в базу"""  # TODO: придумать в каком виде, написать сериализатор
        return super(JourneyViewSet, self).create(request, *args, **kwargs)
