from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.forms import ValidationError

class Client(models.Model):
    last_name = models.CharField(max_length=50, blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    patronymic = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.last_name or ''} {self.first_name or ''}".strip()

    def clean(self):
        """
        Проверка, что хотя бы одно из полей phone или email заполнено.
        """
        if not self.phone and not self.email:
            raise ValidationError("Клиент хотя бы должен иметь номер телефона или email.")

class Realtor(models.Model):
    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    patronymic = models.CharField(max_length=50)
    commission_share = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        blank=True, 
        null=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ]
    )

    def __str__(self):
        return f"{self.last_name} {self.first_name} {self.patronymic}"


class PropertyType(models.TextChoices):
    APARTMENT = 'Квартира', 'Квартира'
    HOUSE = 'Дом', 'Дом'
    LAND = 'Земля', 'Земля'


class Property(models.Model):
    property_type = models.CharField(
        max_length=10, 
        choices=PropertyType.choices
    )
    
    # Адрес
    city = models.CharField(max_length=100, blank=True, null=True)
    street = models.CharField(max_length=100, blank=True, null=True)
    house_number = models.CharField(max_length=10, blank=True, null=True)
    apartment_number = models.CharField(max_length=10, blank=True, null=True)
    
    # Координаты
    latitude = models.FloatField(
        blank=True, null=True,
        validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)]
    )
    longitude = models.FloatField(
        blank=True, null=True,
        validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)]
    )

    # Общие поля для всех типов недвижимости
    area = models.FloatField(blank=True, null=True)  # Площадь (для всех типов)
    
    # Поля для квартир
    floor = models.IntegerField(blank=True, null=True)  # Этаж (только для квартир)
    rooms = models.IntegerField(blank=True, null=True)  # Количество комнат (для квартир и домов)

    # Поля для домов
    floors = models.IntegerField(blank=True, null=True)  # Этажность (только для домов)

    def __str__(self):
        return f"{self.get_property_type_display()} - {self.address or 'Нет адреса'}"

    @property
    def address(self):
        components = [
            self.city,
            self.street,
            self.house_number,
            f"кв. {self.apartment_number}" if self.apartment_number else None
        ]
        return ", ".join(filter(None, components))


    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"

class Offer(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='client_offers'
    )
    realtor = models.ForeignKey(
        Realtor,
        on_delete=models.CASCADE,
        related_name='realtor_offers'
    )
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    price = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    # Метод для проверки, участвует ли предложение в сделке
    def is_in_deal(self):
        return Deal.objects.filter(offer=self).exists()

    def delete(self, *args, **kwargs):
        if self.is_in_deal():
            raise ValidationError("Это предложение не может быть удалено, так как является частью сделки.")
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Offer for {self.property.address} by {self.client} with price {self.price}"

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(price__gt=0), name='offer_price_positive')
        ]

class Need(models.Model):
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='client_needs'
    )
    realtor = models.ForeignKey(
        Realtor,
        on_delete=models.CASCADE,
        related_name='realtor_needs'
    )
    property_type = models.CharField(max_length=10, choices=PropertyType.choices)
    address = models.CharField(max_length=255)
    min_price = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    max_price = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    # Дополнительные поля для квартир
    min_area = models.FloatField(blank=True, null=True)
    max_area = models.FloatField(blank=True, null=True)
    min_rooms = models.IntegerField(blank=True, null=True)
    max_rooms = models.IntegerField(blank=True, null=True)
    min_floor = models.IntegerField(blank=True, null=True)
    max_floor = models.IntegerField(blank=True, null=True)

    # Дополнительные поля для домов
    min_floors = models.IntegerField(blank=True, null=True)
    max_floors = models.IntegerField(blank=True, null=True)

    # Дополнительные поля для земли
    min_land_area = models.FloatField(blank=True, null=True)
    max_land_area = models.FloatField(blank=True, null=True)

    # Метод для проверки, участвует ли потребность в сделке
    def is_in_deal(self):
        return Deal.objects.filter(need=self).exists()

    def delete(self, *args, **kwargs):
        if self.is_in_deal():
            raise ValidationError("Эта потребность не может быть удалена, так как является частью сделки..")
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Need by {self.client} for {self.get_property_type_display()} at {self.address}"

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(min_price__gt=0), name='need_min_price_positive'),
            models.CheckConstraint(check=models.Q(max_price__gt=0), name='need_max_price_positive')
        ]


class Deal(models.Model):
    need = models.ForeignKey(Need, on_delete=models.CASCADE)
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE)

    def calculate_commissions(self):
        """
        Рассчитывает комиссии для продавца, покупателя, риэлторов и компании.
        Возвращает словарь с рассчитанными значениями.
        """
        property = self.offer.property
        price = Decimal(self.offer.price)
        seller_realtor_commission_share = Decimal(self.need.realtor.commission_share or 45)
        buyer_realtor_commission_share = Decimal(self.offer.realtor.commission_share or 45)

        if property.property_type == PropertyType.APARTMENT:
            seller_commission = Decimal(36000) + (Decimal('0.01') * price)
        elif property.property_type == PropertyType.LAND:
            seller_commission = Decimal(30000) + (Decimal('0.02') * price)
        elif property.property_type == PropertyType.HOUSE:
            seller_commission = Decimal(30000) + (Decimal('0.01') * price)
        else:
            seller_commission = Decimal(0)

        buyer_commission = Decimal('0.03') * price

        seller_realtor_payment = (seller_commission * seller_realtor_commission_share) / Decimal(100)
        company_payment_seller = seller_commission - seller_realtor_payment

        buyer_realtor_payment = (buyer_commission * buyer_realtor_commission_share) / Decimal(100)
        company_payment_buyer = buyer_commission - buyer_realtor_payment

        return {
            "seller_commission": seller_commission,
            "buyer_commission": buyer_commission,
            "seller_realtor_payment": seller_realtor_payment,
            "company_payment_seller": company_payment_seller,
            "buyer_realtor_payment": buyer_realtor_payment,
            "company_payment_buyer": company_payment_buyer
        }


    def save(self, *args, **kwargs):
        """
        Сохраняет сделку, проверяя, что потребность и предложение не участвуют в других сделках.
        """
        # Проверяем, связаны ли потребность или предложение с другими сделками
        if Deal.objects.filter(need=self.need).exists():
            raise ValidationError("This need is already part of another deal.")
        if Deal.objects.filter(offer=self.offer).exists():
            raise ValidationError("This offer is already part of another deal.")

        # Сохраняем сделку
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Deal for {self.need} and {self.offer}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['need', 'offer'], name='unique_deal')
        ]