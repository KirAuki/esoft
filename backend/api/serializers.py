from rest_framework import serializers
from .models import Client, Deal, Need, Offer, Property, Realtor

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

    def validate(self, data):
        """
        Проверка, что хотя бы одно из полей phone или email заполнено.
        """
        if not data.get('phone') and not data.get('email'):
            raise serializers.ValidationError(
                "Клиент должен иметь номер телефона или email."
            )
        return data


# Сериализатор для Риэлтора
class RealtorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Realtor
        fields = '__all__'

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
            'latitude', 'longitude', 'area', 'floor', 'rooms', 'floors', 'address'
        ]



class OfferSerializer(serializers.ModelSerializer):
    client = ClientSerializer()
    realtor = RealtorSerializer()
    property = PropertySerializer()
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


class NeedSerializer(serializers.ModelSerializer):
    client = ClientSerializer()
    realtor = RealtorSerializer()
    class Meta:
        model = Need
        fields = ['id','property_type','address','min_price','max_price','min_area','max_area','min_rooms','max_rooms',
                  'min_floor','max_floor','min_floors','max_floors','min_land_area','max_land_area', 'client','realtor']

    def validate(self, data):
        """
        Проверяем корректность минимальных и максимальных значений.
        """
        if data.get('min_price') and data.get('max_price') and data['min_price'] > data['max_price']:
            raise serializers.ValidationError("Минимальная цена не может быть выше максимальной.")
        if 'min_area' in data and 'max_area' in data and data['min_area'] > data['max_area']:
            raise serializers.ValidationError("Максимальная цена не может быть выше минимальной.")
        return data


class DealSerializer(serializers.ModelSerializer):
    need = NeedSerializer()
    offer = OfferSerializer()
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