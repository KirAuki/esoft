from rest_framework import serializers
from .models import Apartment, Client, Deal, House, Land, Need, Offer, Property, Realtor

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
                "Client must have either a phone number or an email address."
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
                "Realtor must have last name, first name, and patronymic."
            )
        commission_share = data.get('commission_share')
        if commission_share is not None and (commission_share < 0 or commission_share > 100):
            raise serializers.ValidationError(
                "Commission share must be between 0 and 100."
            )
        return data


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'


class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = '__all__'


class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = '__all__'


class LandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Land
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'

    def validate(self, data):
        """
        Проверяем, что предложение корректное.
        """
        if data['price'] <= 0:
            raise serializers.ValidationError("Price must be a positive integer.")
        return data


class NeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Need
        fields = '__all__'

    def validate(self, data):
        """
        Проверяем корректность минимальных и максимальных значений.
        """
        if data.get('min_price') and data.get('max_price') and data['min_price'] > data['max_price']:
            raise serializers.ValidationError("Minimum price cannot be greater than maximum price.")
        if 'min_area' in data and 'max_area' in data and data['min_area'] > data['max_area']:
            raise serializers.ValidationError("Minimum area cannot be greater than maximum area.")
        return data


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = '__all__'

    def validate(self, data):
        """
        Проверяем, что потребность и предложение не заняты.
        """
        if data['need'].is_in_deal():
            raise serializers.ValidationError("The selected need is already part of a deal.")
        if data['offer'].is_in_deal():
            raise serializers.ValidationError("The selected offer is already part of a deal.")
        return data