from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet, PropertyViewSet

# Создание маршрутизаторов для viewset
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'properties', PropertyViewSet, basename='property')

urlpatterns = [
    # Включаем маршруты, созданные автоматически с помощью DefaultRouter
    path('', include(router.urls)),
    # Дополнительные пути для кастомных действий
    path('users/search/', UserViewSet.as_view({'get': 'search'}), name='user-search'),
    path('properties/search-by-address/', PropertyViewSet.as_view({'get': 'search_by_address'}), name='property-search-by-address'),
    path('properties/search-by-polygon/', PropertyViewSet.as_view({'get': 'search_by_polygon'}), name='property-search-by-polygon'),
]