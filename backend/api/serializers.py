from rest_framework import serializers
from .models import User, Property, Apartment, House, Land

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ClientSerializer(UserSerializer):
    # В сериализаторе клиента можно добавить валидацию, чтобы телефон или email были обязательными для клиента
    def validate(self, data):
        phone = data.get('phone')
        email = data.get('email')
        if not phone and not email:
            raise serializers.ValidationError("Client must have either a phone number or an email address.")
        return data

class RealtorSerializer(UserSerializer):
    # Дополнительная валидация для риэлторов, если нужно
    def validate(self, data):
        if not data.get('first_name') or not data.get('last_name') or not data.get('patronymic'):
            raise serializers.ValidationError("Realtor must have first name, last name, and patronymic.")
        return data



class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'


class ApartmentSerializer(PropertySerializer):
    class Meta:
        model = Apartment
        fields = '__all__'


class HouseSerializer(PropertySerializer):
    class Meta:
        model = House
        fields = '__all__'


class LandSerializer(PropertySerializer):
    class Meta:
        model = Land
        fields = '__all__'