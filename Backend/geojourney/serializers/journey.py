from rest_framework import serializers


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
        # потом вызвать метод Ильи
        pass
