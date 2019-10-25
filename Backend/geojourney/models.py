from django.db import models


# Create your models here.

class Spot(models.Model):
    name = models.CharField(max_length=64)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True)


class Journey(models.Model):
    name = models.CharField(max_length=64)
    spots = models.ManyToManyField(Spot)
