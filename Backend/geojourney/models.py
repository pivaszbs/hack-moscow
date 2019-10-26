from django.db import models


# python3 manage.py makemigrations && python3 manage.py migrate
# Create your models here.

class Spot(models.Model):
    href = models.CharField(max_length=264)


class Journey(models.Model):
    name = models.CharField(max_length=64)
    spots = models.ManyToManyField(Spot)
