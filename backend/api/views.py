from django.forms import ValidationError
import django_filters
from rest_framework.decorators import api_view
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import  Client, Deal, Need, Offer,Property, Realtor
from .serializers import ApartmentSerializer, ClientSerializer, DealSerializer, HouseSerializer, LandSerializer, NeedSerializer, OfferSerializer, RealtorSerializer,PropertySerializer
from geopy.distance import geodesic
from shapely.geometry import Point, Polygon
import Levenshtein
from rest_framework import filters ,viewsets,status
from rest_framework.exceptions import NotFound
from django.db.models import Q

class ClientViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления клиентами: создание, обновление и удаление клиентов.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def create(self, request, *args, **kwargs):
        """
        Создание нового клиента.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Обновление информации о клиенте.
        """
        client = self.get_object()
        serializer = self.get_serializer(client, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Удаление клиента с проверкой на связь с потребностью, предложением или сделкой.
        """
        client = self.get_object()

        if not self.can_delete(client):
            return Response(
                {"error": "Клиент связан с существующей потребностью или предложением."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_destroy(client)
        return Response({"message": "Клиент успешно удален."}, status=status.HTTP_204_NO_CONTENT)

    def can_delete(self, client):
        """
        Проверяет, можно ли удалить клиента.
        """
        if (
            Need.objects.filter(client=client).exists() or
            Offer.objects.filter(client=client).exists()
        ):
            return False
        return True
    
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """
        Поиск клиентов по ФИО с использованием расстояния Левенштейна.
        """
        search_query = request.query_params.get('query', '').strip()

        if not search_query:
            return Response({'error': 'Query parameter is required'}, status=400)

        search_parts = search_query.lower().split()
        matching_clients = []

        for client in Client.objects.all():
            client_parts = [client.first_name, client.last_name, client.patronymic]
            client_parts = [part.lower() for part in client_parts if part]

            if self._is_match(search_parts, client_parts):
                matching_clients.append(client)

        serializer = self.get_serializer(matching_clients, many=True)
        return Response(serializer.data)

    def _is_match(self, search_parts, client_parts):
        for search_part in search_parts:
            for client_part in client_parts:
                if Levenshtein.distance(search_part, client_part) <= 3:
                    return True
        return False


class RealtorViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления риэлторами: создание, обновление и удаление риэлторов.
    """
    queryset = Realtor.objects.all()
    serializer_class = RealtorSerializer

    def create(self, request, *args, **kwargs):
        """
        Создание нового риэлтора.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Обновление информации о риэлторе.
        """
        realtor = self.get_object()
        serializer = self.get_serializer(realtor, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Удаление риэлтора.
        """
        realtor = self.get_object()
        if not self.can_delete(realtor):
            return Response(
                {"error": "Риелтор связан с существующей потребностью или предложением."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_destroy(realtor)
        return Response({"message": "Риелтор успешно удален."}, status=status.HTTP_204_NO_CONTENT)
    
    def can_delete(self, realtor):
        """
        Проверяет, можно ли удалить риелтора.
        """
        if (
            Need.objects.filter(realtor=realtor).exists() or
            Offer.objects.filter(realtor=realtor).exists()
        ):
            return False
        return True
    
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """
        Поиск риэлторов по ФИО с использованием расстояния Левенштейна.
        """
        search_query = request.query_params.get('query', '').strip()

        if not search_query:
            return Response({'error': 'Query parameter is required'}, status=400)

        search_parts = search_query.lower().split()
        matching_realtors = []

        for realtor in Realtor.objects.all():
            realtor_parts = [realtor.first_name, realtor.last_name, realtor.patronymic]
            realtor_parts = [part.lower() for part in realtor_parts if part]

            if self._is_match(search_parts, realtor_parts):
                matching_realtors.append(realtor)

        serializer = self.get_serializer(matching_realtors, many=True)
        return Response(serializer.data)

    def _is_match(self, search_parts, realtors_parts):
        for search_part in search_parts:
            for realtors_part in realtors_parts:
                if Levenshtein.distance(search_part, realtors_part) <= 3:
                    return True
        return False

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()

    def get_serializer_class(self):
        """
        Возвращаем сериализатор в зависимости от типа недвижимости.
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

    def destroy(self, request, *args, **kwargs):
        """
        Переопределяем метод destroy для проверки связанных предложений.
        """
        instance = self.get_object()
        if instance.offer_set.exists():  # Проверка на наличие связанного предложения
            return Response(
                {'error': 'This property is linked to an offer and cannot be deleted.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

    
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
    
class OfferViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с предложениями: создание, редактирование, удаление.
    """
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

    def destroy(self, request, *args, **kwargs):
        """
        Проверяем, участвует ли предложение в сделке перед удалением.
        """
        offer = self.get_object()
        if offer.is_in_deal():
            return Response({'error': 'This offer is part of a deal and cannot be deleted.'},
                            status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'], url_path='matching-needs')
    def matching_needs(self, request, pk=None):
        """
        Возвращает список потребностей, которые могут быть удовлетворены данным предложением.
        """
        offer = self.get_object()

        matching_needs = Need.objects.filter(
            property_type=offer.property.property_type,
            min_price__lte=offer.price,
            max_price__gte=offer.price,
        )

        # Дополнительные условия для фильтрации
        if offer.property.area:
            matching_needs = matching_needs.filter(
                Q(min_area__lte=offer.property.area) | Q(min_area__isnull=True),
                Q(max_area__gte=offer.property.area) | Q(max_area__isnull=True),
            )

        serializer = NeedSerializer(matching_needs, many=True)
        return Response({
            'needs': serializer.data,
            'create_deal_endpoint': request.build_absolute_uri('/api/deals/')
        })
    
class NeedViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с потребностями: создание, редактирование, удаление.
    """
    queryset = Need.objects.all()
    serializer_class = NeedSerializer

    def destroy(self, request, *args, **kwargs):
        """
        Проверяем, участвует ли потребность в сделке перед удалением.
        """
        need = self.get_object()
        if need.is_in_deal():
            return Response({'error': 'This need is part of a deal and cannot be deleted.'},
                            status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'], url_path='matching-offers')
    def matching_offers(self, request, pk=None):
        """
        Возвращает список предложений, которые удовлетворяют выбранную потребность.
        """
        need = self.get_object()

        matching_offers = Offer.objects.filter(
            property__property_type=need.property_type,
            price__gte=need.min_price,
            price__lte=need.max_price,
        )

        # Дополнительные условия для фильтрации
        if need.min_area:
            matching_offers = matching_offers.filter(property__area__gte=need.min_area)
        if need.max_area:
            matching_offers = matching_offers.filter(property__area__lte=need.max_area)

        serializer = OfferSerializer(matching_offers, many=True)
        return Response({
            'offers': serializer.data,
            'create_deal_endpoint': request.build_absolute_uri('/api/deals/')
        })

class DealViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы со сделками: создание, редактирование, удаление.
    """
    queryset = Deal.objects.all()
    serializer_class = DealSerializer

    

    def create(self, request, *args, **kwargs):
        """
        Проверяем, можно ли создать сделку.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        """
        Обновляем состояние потребности и предложения при создании сделки.
        """
        deal = serializer.save()
        deal.need.is_active = False
        deal.need.save()
        deal.offer.is_active = False
        deal.offer.save()

    @action(detail=True, methods=['get'], url_path='commissions')
    def retrieve_commissions(self, request, pk=None):
        """
        Возвращает рассчитанные комиссии и отчисления для выбранной сделки.
        """
        deal = self.get_object()
        commissions = deal.calculate_commissions()
        return Response(commissions)

    