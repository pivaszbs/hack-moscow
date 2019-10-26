import requests
from rest_framework import serializers
from django.conf import settings

from geojourney.models import Journey, Spot


class CreateJourneySerializer(serializers.Serializer):
    # userId, city, startPoint, endPoint, duration (mins), distance, filters

    city = serializers.CharField()
    start_point_latitude = serializers.FloatField()
    start_point_longitude = serializers.FloatField()
    end_point_latitude = serializers.FloatField()
    end_point_longitude = serializers.FloatField()
    duration = serializers.IntegerField()  # in minutes
    distance = serializers.FloatField()  # in km (maybe IntegerField)
    filters = serializers.ListField()  # categories

    def create(self, validated_data):
        # нужно юзать апишку чтобы достать все точки в городе, соответствующие фильтрам (предпочтениям)
        response = requests.get(f'https://places.cit.api.here.com/places/v1/discover/explore'
                                f'?app_id={settings.APP_ID}'
                                f'&app_code={settings.APP_CODE}'
                                f'&at=52.50449,13.39091'  # чо
                                f'&pretty')

        # потом вызвать метод Ильи

        pass


class SpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spot
        fields = '__all__'


class JourneySerializer(serializers.ModelSerializer):
    spots = SpotSerializer(many=True)

    class Meta:
        model = Journey
        fields = '__all__'
