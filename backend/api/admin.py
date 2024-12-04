from django.contrib import admin
from .models import Client, Deal, Need, Offer,Property, Realtor,Apartment,House,Land

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'patronymic', 'phone', 'email')
    search_fields = ('last_name', 'first_name', 'patronymic', 'phone', 'email')
    list_filter = ('last_name', 'first_name')
    ordering = ('last_name',)

@admin.register(Realtor)
class RealtorAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'patronymic', 'commission_share')
    search_fields = ('last_name', 'first_name', 'patronymic')
    list_filter = ('commission_share',)
    ordering = ('last_name',)

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('property_type', 'address', 'latitude', 'longitude')
    search_fields = ('city', 'street', 'house_number', 'apartment_number')
    list_filter = ('property_type',)
    ordering = ('property_type',)

@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ('address', 'floor', 'rooms', 'area')
    search_fields = ('city', 'street', 'house_number', 'apartment_number')
    list_filter = ('floor', 'rooms')

@admin.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = ('address', 'floors', 'rooms', 'area')
    search_fields = ('city', 'street', 'house_number', 'apartment_number')
    list_filter = ('floors', 'rooms')

class LandAdmin(admin.ModelAdmin):
    list_display = ('address', 'area')
    search_fields = ('city', 'street', 'house_number', 'apartment_number')
    list_filter = ('area',)
    ordering = ('address',)



@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'realtor', 'property', 'price')
    search_fields = ('client__first_name', 'client__last_name', 'realtor__first_name', 'realtor__last_name')
    list_filter = ('property__property_type',)


@admin.register(Need)
class NeedAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'realtor', 'property_type', 'address', 'min_price', 'max_price')
    search_fields = ('client__first_name', 'client__last_name', 'realtor__first_name', 'realtor__last_name', 'address')
    list_filter = ('property_type',)


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('id', 'need', 'offer')
    search_fields = ('need__client__first_name', 'need__client__last_name', 'offer__client__first_name', 'offer__client__last_name')
    list_filter = ('need__property_type',)



