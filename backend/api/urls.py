from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ClientViewSet, DealViewSet, ActViewSet, NeedViewSet, PropertyViewSet,OfferViewSet, RealtorViewSet
from django.conf import settings
from django.conf.urls.static import static

# Создание маршрутизаторов для viewset
router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'realtors', RealtorViewSet, basename='realtor')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'offers', OfferViewSet, basename='offer')
router.register(r'needs', NeedViewSet, basename='need')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'acts', ActViewSet)

urlpatterns = [
    # Включаем маршруты, созданные автоматически с помощью DefaultRouter
    path('', include(router.urls)),
    # Дополнительные пути для кастомных действий
    path('properties/search/address/', PropertyViewSet.as_view({'get': 'search_by_address'}), name='property-search-by-address'),
    path('properties/search/polygon/', PropertyViewSet.as_view({'get': 'search_in_region'}), name='property-search-by-polygon'),
] 
