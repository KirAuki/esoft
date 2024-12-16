from rest_framework import serializers
from .models import Act, Client, Deal, Need, Offer, Property, Realtor

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'last_name', 'first_name', 'patronymic', 'phone', 'email', 'full_name']

    def validate(self, data):
        """
        Проверка, что хотя бы одно из полей phone или email заполнено.
        """
        if not data.get('phone') and not data.get('email'):
            raise serializers.ValidationError(
                "Клиент должен иметь номер телефона или email."
            )
        return data


class RealtorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Realtor
        fields = ['id', 'last_name', 'first_name', 'patronymic', 'commission_share', 'full_name']

    def validate(self, data):
        """
        Проверка обязательности заполнения полей ФИО.
        """
        if not data.get('last_name') or not data.get('first_name') or not data.get('patronymic'):
            raise serializers.ValidationError(
                "Риелтор должен иметь полное ФИО."
            )
        commission_share = data.get('commission_share')
        if commission_share is not None and (commission_share < 0 or commission_share > 100):
            raise serializers.ValidationError(
                "Комиссия должна быть от 0 до 100."
            )
        return data


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id', 'property_type', 'city', 'street', 'house_number', 'apartment_number',
            'latitude', 'longitude', 'area', 'floor', 'rooms', 'floors', 'address','image'
        ]
      

class OfferSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())
    realtor = serializers.PrimaryKeyRelatedField(queryset=Realtor.objects.all())
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    class Meta:
        model = Offer
        fields = ['id','price','client','realtor','property']

    def validate(self, data):
        """
        Проверяем, что предложение корректное.
        """
        if data['price'] <= 0:
            raise serializers.ValidationError("Цена должна быть положительным числом.")
        return data
    
    def to_representation(self, instance):
        """
        Переопределяем метод для представления данных.
        """
        representation = super().to_representation(instance)
        # Добавляем вложенные объекты
        representation['client'] = {
            "id": instance.client.id,
            "last_name": instance.client.last_name,
            "first_name": instance.client.first_name,
            "patronymic": instance.client.patronymic,
            "phone": instance.client.phone,
            "email": instance.client.email,
            "full_name": instance.client.full_name,
        }
        representation['realtor'] = {
            "id": instance.realtor.id,
            "last_name": instance.realtor.last_name,
            "first_name": instance.realtor.first_name,
            "patronymic": instance.realtor.patronymic,
            "commission_share": instance.realtor.commission_share,
            "full_name": instance.realtor.full_name,
        }
        representation['property'] = {
            "id": instance.property.id,
            "property_type": instance.property.property_type,
            "city": instance.property.city,
            "street": instance.property.street,
            "house_number": instance.property.house_number,
            "apartment_number": instance.property.apartment_number,
            "latitude": instance.property.latitude,
            "longitude": instance.property.longitude,
            "area": instance.property.area,
            "floor": instance.property.floor,
            "rooms": instance.property.rooms,
            "floors": instance.property.floors,
            "address": instance.property.address,
        }
        return representation


class NeedSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())
    realtor = serializers.PrimaryKeyRelatedField(queryset=Realtor.objects.all())
    class Meta:
        model = Need
        fields = ['id','property_type','address','city', 'street', 'house_number', 'apartment_number','min_price','max_price','min_area','max_area','min_rooms','max_rooms',
                  'min_floor','max_floor','min_floors','max_floors','client','realtor']

    def validate(self, data):
        """
        Проверяем корректность минимальных и максимальных значений.
        """
        if data.get('min_price') and data.get('max_price') and data['min_price'] > data['max_price']:
            raise serializers.ValidationError("Минимальная цена не может быть выше максимальной.")
        
        return data
    
    def to_representation(self, instance):
        """
        Переопределяем метод для представления данных.
        """
        representation = super().to_representation(instance)
        # Добавляем вложенные объекты
        representation['client'] = {
            "id": instance.client.id,
            "last_name": instance.client.last_name,
            "first_name": instance.client.first_name,
            "patronymic": instance.client.patronymic,
            "phone": instance.client.phone,
            "email": instance.client.email,
            "full_name": instance.client.full_name,
        }
        representation['realtor'] = {
            "id": instance.realtor.id,
            "last_name": instance.realtor.last_name,
            "first_name": instance.realtor.first_name,
            "patronymic": instance.realtor.patronymic,
            "commission_share": instance.realtor.commission_share,
            "full_name": instance.realtor.full_name,
        }
        return representation

class DealSerializer(serializers.ModelSerializer):
    need= serializers.PrimaryKeyRelatedField(queryset=Need.objects.all())
    offer = serializers.PrimaryKeyRelatedField(queryset=Offer.objects.all())
    class Meta:
        model = Deal
        fields = ['id', 'need' , 'offer']

    def validate(self, data):
        """
        Проверяем, что потребность и предложение не заняты.
        """
        if data['need'].is_in_deal():
            raise serializers.ValidationError("Выбранная потребность уже является частью сделки.")
        if data['offer'].is_in_deal():
            raise serializers.ValidationError("Выбранное предложение уже является частью сделки.")
        return data
    
    def to_representation(self, instance):
        """
        Переопределяем метод для представления данных.
        """
        representation = super().to_representation(instance)
        representation['need'] = {
            "id": instance.need.id,
            "property_type": instance.need.property_type,
            "address": instance.need.address,
            "min_price": instance.need.min_price,
            "max_price": instance.need.max_price,
            "min_area": instance.need.min_area,
            "max_area": instance.need.max_area,
            "min_rooms": instance.need.min_rooms,
            "max_rooms": instance.need.max_rooms,
            "min_floor": instance.need.min_floor,
            "max_floor": instance.need.max_floor,
            "min_floors": instance.need.min_floors,
            "max_floors": instance.need.max_floors,
            "client": {
                "id": instance.need.client.id,
                "last_name": instance.need.client.last_name,
                "first_name": instance.need.client.first_name,
                "patronymic": instance.need.client.patronymic,
                "phone": instance.need.client.phone,
                "email": instance.need.client.email,
                "full_name": instance.need.client.full_name,
            },
            "realtor": {
                "id": instance.need.realtor.id,
                "last_name": instance.need.realtor.last_name,
                "first_name": instance.need.realtor.first_name,
                "patronymic": instance.need.realtor.patronymic,
                "commission_share": instance.need.realtor.commission_share,
                "full_name": instance.need.realtor.full_name,
            },
        }
        representation['offer'] = {
            "id": instance.offer.id,
            "price": instance.offer.price,
            "client": {
                "id": instance.offer.client.id,
                "last_name": instance.offer.client.last_name,
                "first_name": instance.offer.client.first_name,
                "patronymic": instance.offer.client.patronymic,
                "phone": instance.offer.client.phone,
                "email": instance.offer.client.email,
                "full_name": instance.offer.client.full_name,
            },
            "realtor": {
                "id": instance.offer.realtor.id,
                "last_name": instance.offer.realtor.last_name,
                "first_name": instance.offer.realtor.first_name,
                "patronymic": instance.offer.realtor.patronymic,
                "commission_share": instance.offer.realtor.commission_share,
                "full_name": instance.offer.realtor.full_name,
            },
            "property": {
                "id": instance.offer.property.id,
                "property_type": instance.offer.property.property_type,
                "city": instance.offer.property.city,
                "street": instance.offer.property.street,
                "house_number": instance.offer.property.house_number,
                "apartment_number": instance.offer.property.apartment_number,
                "latitude": instance.offer.property.latitude,
                "longitude": instance.offer.property.longitude,
                "area": instance.offer.property.area,
                "floor": instance.offer.property.floor,
                "rooms": instance.offer.property.rooms,
                "floors": instance.offer.property.floors,
                "address": instance.offer.property.address,
            },
        }
        return representation
    


class ActSerializer(serializers.ModelSerializer):
    class Meta:
        model = Act
        fields = ['id', 'date_time', 'duration', 'act_type', 'comment']