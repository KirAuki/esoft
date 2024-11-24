from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class User(models.Model):
    USER_TYPE_CHOICES = (
        ('client', 'Client'),
        ('realtor', 'Realtor'),
    )

    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    patronymic = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    commission_share = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user_type})"



class Property(models.Model):
    PROPERTY_TYPE_CHOICES = (
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('land', 'Land'),
    )

    property_type = models.CharField(max_length=10, choices=PROPERTY_TYPE_CHOICES)
    city = models.CharField(max_length=100, blank=True, null=True)
    street = models.CharField(max_length=100, blank=True, null=True)
    house_number = models.CharField(max_length=10, blank=True, null=True)
    apartment_number = models.CharField(max_length=10, blank=True, null=True)
    latitude = models.FloatField(
        blank=True, null=True,
        validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)]
    )
    longitude = models.FloatField(
        blank=True, null=True,
        validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)]
    )

    @property
    def address(self):
        """
        Формирует адрес объекта недвижимости.
        """
        return f"{self.city or ''}, {self.street or ''}, {self.house_number or ''}, {self.apartment_number or ''}".strip(", ")

    def __str__(self):
        return f"{self.get_property_type_display()} - {self.address or 'No Address'}"


class Apartment(Property):
    floor = models.IntegerField(blank=True, null=True)
    rooms = models.IntegerField(blank=True, null=True)
    area = models.FloatField(blank=True, null=True)


class House(Property):
    floors = models.IntegerField(blank=True, null=True)
    rooms = models.IntegerField(blank=True, null=True)
    area = models.FloatField(blank=True, null=True)


class Land(Property):
    area = models.FloatField(blank=True, null=True)