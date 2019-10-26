from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from geojourney.serializers.journey import CreateJourneySerializer


class JourneyViewSet(ListModelMixin, CreateModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = None  # WIP
    permission_classes = (IsAuthenticated,)

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

    def create(self, request, *args, **kwargs):
        """По сути просто записывает новое путешествие в базу"""  # TODO: придумать в каком виде, написать сериализатор
        return super(JourneyViewSet, self).create(request, *args, **kwargs)



