import django_filters
from rest_framework.decorators import api_view
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Property, Apartment, House, Land
from .serializers import ClientSerializer, RealtorSerializer,PropertySerializer, ApartmentSerializer, HouseSerializer, LandSerializer
from geopy.distance import geodesic
from shapely.geometry import Point, Polygon
import Levenshtein
from rest_framework import filters ,viewsets,status
from rest_framework.exceptions import NotFound


class UserViewSet(viewsets.ModelViewSet):
    """
    Обрабатывает операции с пользователями: создание, обновление, удаление, получение списка.
    """
    queryset = User.objects.all()

    def get_serializer_class(self):
        """
        Возвращает соответствующий сериализатор в зависимости от типа пользователя.
        """
        if self.action in ['list', 'create']:
            return ClientSerializer if self.request.data.get('user_type') == 'client' else RealtorSerializer
        return ClientSerializer if self.request.user.user_type == 'client' else RealtorSerializer

    def list(self, request, *args, **kwargs):
        """
        Получаем список всех пользователей (клиентов и риэлторов).
        """
        clients = User.objects.filter(user_type='client')
        realtors = User.objects.filter(user_type='realtor')
        
        clients_serializer = ClientSerializer(clients, many=True)
        realtors_serializer = RealtorSerializer(realtors, many=True)
        
        return Response({
            'clients': clients_serializer.data,
            'realtors': realtors_serializer.data
        })
    
    def perform_create(self, serializer):
        """
        Сохраняем данные пользователя с учетом типа пользователя.
        """
        user_type = self.request.data.get('user_type')
        if user_type == 'client':
            serializer.save(user_type=user_type)
        elif user_type == 'realtor':
            serializer.save(user_type=user_type)
        else:
            raise NotFound(detail="Invalid user type")

    def update(self, request, *args, **kwargs):
        """
        Обновляем информацию о пользователе.
        """
        user = self.get_object()
        if user.user_type != request.data.get('user_type'):
            return Response({'error': 'User type mismatch'}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Удаление пользователя, проверяя связи с другими моделями.
        """
        user = self.get_object()
        # Проверяем связи с другими моделями (например, потребности или предложения)
        if hasattr(user, 'some_related_model'):
            return Response({'error': 'User is linked to another model and cannot be deleted'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """
        Поиск клиентов и риэлторов по ФИО с использованием расстояния Левенштейна.
        """
        search_query = request.query_params.get('query', '').strip()

        if not search_query:
            return Response({'error': 'Query parameter is required'}, status=400)

        users = User.objects.all()
        matching_users = []

        search_parts = search_query.lower().split()

        for user in users:
            user_parts = [user.first_name, user.last_name, user.patronymic]
            user_parts = [part.lower() for part in user_parts if part]

            match_found = False
            for search_part in search_parts:
                for user_part in user_parts:
                    distance = Levenshtein.distance(search_part, user_part)
                    if distance <= 3:
                        match_found = True
                        break
                if match_found:
                    break

            if match_found:
                matching_users.append(user)

        clients_data = []
        realtors_data = []

        for user in matching_users:
            if user.user_type == 'client':
                serializer = ClientSerializer(user)
                clients_data.append(serializer.data)
            else:
                serializer = RealtorSerializer(user)
                realtors_data.append(serializer.data)

        return Response({
            'clients': clients_data,
            'realtors': realtors_data
        })



class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()

    def get_serializer_class(self):
        """
        Возвращает сериализатор в зависимости от типа объекта недвижимости.
        """
        if self.action in ['create', 'update']:
            property_type = self.request.data.get('property_type')
            if property_type == 'apartment':
                return ApartmentSerializer
            elif property_type == 'house':
                return HouseSerializer
            elif property_type == 'land':
                return LandSerializer
        return PropertySerializer

    
    @action(detail=False, methods=['get'])
    def search_by_address(self, request):
        """
        Поиск объектов недвижимости по адресу с использованием расстояния Левенштейна.
        """
        query = request.query_params.get('query', '').strip().lower()
        if not query:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Разбиваем запрос на части
        query_parts = query.split()

        properties = Property.objects.all()
        matching_properties = []

        for property in properties:
            # Подготовка частей адреса
            city = (property.city or '').lower()
            street = (property.street or '').lower()
            house_number = (property.house_number or '').lower()
            apartment_number = (property.apartment_number or '').lower()

            # Расчёт расстояний для каждой части
            city_distance = min([Levenshtein.distance(query_part, city) for query_part in query_parts], default=100)
            if city_distance <= 3:
                matching_properties.append(property)
                print(f"Matched by City: {property}, Distance: {city_distance}")
                continue  # Если город подходит, остальные параметры не проверяем

            street_distance = min([Levenshtein.distance(query_part, street) for query_part in query_parts], default=100)
            if street_distance <= 3:
                matching_properties.append(property)
                print(f"Matched by Street: {property}, Distance: {street_distance}")
                continue  # Если улица подходит, остальные параметры не проверяем

            house_distance = (
                min([Levenshtein.distance(query_part, house_number) for query_part in query_parts], default=100)
                if house_number else 0
            )
            if house_number and house_distance <= 1:
                matching_properties.append(property)
                print(f"Matched by House: {property}, Distance: {house_distance}")
                continue  # Если номер дома подходит, остальные параметры не проверяем

            apartment_distance = (
                min([Levenshtein.distance(query_part, apartment_number) for query_part in query_parts], default=100)
                if apartment_number else 0
            )
            if apartment_number and apartment_distance <= 1:
                matching_properties.append(property)
                print(f"Matched by Apartment: {property}, Distance: {apartment_distance}")
                continue  # Если номер квартиры подходит, остальные параметры не проверяем

        serializer = PropertySerializer(matching_properties, many=True)
        return Response(serializer.data)




    @action(detail=False, methods=['get'])
    def search_by_polygon(self, request):
        """
        Поиск объектов недвижимости, находящихся внутри указанного района.
        """
        polygon_coords = request.query_params.getlist('polygon', [])
        if not polygon_coords:
            return Response({'error': 'Polygon coordinates are required'}, status=status.HTTP_400_BAD_REQUEST)

        polygon = Polygon([(float(lat), float(lon)) for lat, lon in (coord.split(',') for coord in polygon_coords)])
        matching_properties = []

        for property in Property.objects.filter(latitude__isnull=False, longitude__isnull=False):
            property_point = Point(property.latitude, property.longitude)
            if polygon.contains(property_point):
                matching_properties.append(property)

        serializer = PropertySerializer(matching_properties, many=True)
        return Response(serializer.data)