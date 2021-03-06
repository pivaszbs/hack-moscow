import requests
from rest_framework import serializers
from django.conf import settings

from geojourney.models import Journey, Spot

from math import sin, cos, sqrt, atan2, radians

from geojourney.services.generate_journeys import JourneyGenerator
from geojourney.services.triangulation import Point


def get_distance_between_coordinates(lat1, lon1, lat2, lon2):
    # approximate radius of earth in km
    R = 6373.0

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c

    return distance * 1000  # метры


class CreateJourneySerializer(serializers.Serializer):
    # userId, city, startPoint, endPoint, duration (mins), distance, filters

    city = serializers.CharField()
    start_point_latitude = serializers.FloatField(required=False)
    start_point_longitude = serializers.FloatField(required=False)
    end_point_latitude = serializers.FloatField(required=False)
    end_point_longitude = serializers.FloatField(required=False)
    duration = serializers.IntegerField()  # in minutes
    distance = serializers.FloatField()  # in km (maybe IntegerField)  # либо duration либо distance, либо оба TODO: валидация
    filters = serializers.ListField()  # categories

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        # city_bounds = requests.get(f'https://geocoder.api.here.com/6.2/geocode.json'
        #                            f'?app_id={settings.APP_ID}'
        #                            f'&app_code={settings.APP_CODE}'
        #                            f'&searchtext={validated_data["city"]}')\
        #     .json()
        # topleft = city_bounds['Response']['View'][0]['Result'][0]['Location']['MapView']['TopLeft']
        # bottomright = city_bounds['Response']['View'][0]['Result'][0]['Location']['MapView']['BottomRight']

        if validated_data.get('distance', False):
            distance = validated_data['distance']
        else:
            distance = validated_data[
                           'duration'] / 60 * 8  # duration в минутах, делим чтобы получить часы, умножаем на 8 км/ч

        start_point = [validated_data['start_point_latitude'] if validated_data.get('start_point_latitude') else 55.753781489660035, validated_data['start_point_longitude'] if validated_data.get('start_point_longitude') else 37.63358116149902]
        end_point = [validated_data['end_point_latitude'] if validated_data.get('end_point_latitude') else 55.753395077731085, validated_data['end_point_longitude'] if validated_data.get('end_point_longitude') else 37.63358116149902]

        # start_end_distance = get_distance_between_coordinates(start_point[0],
        #                                                       start_point[1],
        #                                                       end_point[0],
        #                                                       end_point[1])
        # if start_end_distance < distance:
        #     distance = int(start_end_distance)

        filters = str(validated_data["filters"]).replace("\'", "").replace("[", "").replace("]", "")
        filters = ""
        for i in filters:
            filters += i['id'] + ','
        # нужно юзать апишку чтобы достать все точки в городе, соответствующие фильтрам (предпочтениям)

        # points to give to Ilya
        points = []

        # getting all objects (overcoming pagination) # TODO: попробовать с лимитом 100 (дефолт похоже 2)
        url = f'https://places.cit.api.here.com/places/v1/discover/explore' \
            f'?app_id={settings.APP_ID}' \
            f'&app_code={settings.APP_CODE}' \
            f'&in={start_point[0]},{start_point[1]};r={distance}' \
            f'&cat={filters}' \
            f'&size=100' \
            f'&pretty'
        response = requests.get(url).json()

        for i in response['results']['items']:
            x = i['position'][0]
            y = i['position'][1]
            href = i['href']
            points.append([x, y, href])
        print(response['results'].get('next', False))

        # while response.get('results', False):
        #     for i in response['results']['items']:
        #         x = i['position'][0]
        #         y = i['position'][1]
        #         href = i['href']
        #         points.append([x, y, href])
        #
        #     url = response['results']['next']
        #     response = requests.get(url).json()
        #
        # # pizdec ih paginaciya ya ebal
        # while response.get('next', False):
        #     for i in response['items']:
        #         x = i['position'][0]
        #         y = i['position'][1]
        #         href = i['href']
        #         points.append([x, y, href])
        #     url = response.get('next')
        #     response = requests.get(url).json()
        #
        # # i eshe odin raz nahoooy
        # for i in response['items']:
        #     x = i['position'][0]
        #     y = i['position'][1]
        #     href = i['href']
        #     points.append([x, y, href])

        points = [Point(i[0], i[1], href=i[2], weight=1) for i in points[:10]]
        print(f"Found {len(points)} points")
        generator = JourneyGenerator(points)
        is_cycle = True if start_point[0] == end_point[0] and start_point[1] == end_point[1] else False
        journey = generator.get_journey(Point(start_point[0], start_point[1]), Point(end_point[0], end_point[1]),
                                        duration=validated_data.get('duration', None),
                                        distance=validated_data.get('distance', None), is_cycle=is_cycle)

        # serializing
        journey = [{'latitude': i.x if i.x else 37.63358116149902, 'longitude': i.y if i.y else 37.621307373046875, 'href': i.href} for i in journey]
        out = {'journey': journey,
               'waypoints': {}}
        for i in range(len(journey)):
            out['waypoints'][f'waypoint{i}'] = f"{journey[i]['latitude']}, {journey[i]['longitude']}"

        return out


class SpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spot
        fields = '__all__'


class JourneySerializer(serializers.ModelSerializer):
    spots = SpotSerializer(many=True)

    class Meta:
        model = Journey
        fields = '__all__'
