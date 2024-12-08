from django.contrib import admin
from .models import Client, Deal, Need, Offer,Property, Realtor

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
    # Поля, которые будут отображаться в списке объектов недвижимости
    list_display = (
        'id','property_type', 'city','street','house_number','apartment_number','latitude','longitude','area','floor','rooms','floors'
    )
    
    # Фильтрация объектов недвижимости в админке
    list_filter = ('property_type', 'city', 'rooms')

    # Поля, которые можно будет искать
    search_fields = ('city', 'street', 'house_number', 'apartment_number')

    # Группировка полей для редактирования в форме
    fieldsets = (
        ('Общая информация', {
            'fields': ('property_type', 'city', 'street', 'house_number', 'apartment_number')
        }),
        ('Координаты', {
            'fields': ('latitude', 'longitude')
        }),
        ('Детали объекта', {
            'fields': ('area', 'floor', 'rooms', 'floors')
        }),
    )

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



