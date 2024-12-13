from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import Client, Deal, Need, Offer, Property, Realtor,Act

# Определение ресурсов для импорта/экспорта
class ClientResource(resources.ModelResource):
    class Meta:
        model = Client

class RealtorResource(resources.ModelResource):
    class Meta:
        model = Realtor

class PropertyResource(resources.ModelResource):
    class Meta:
        model = Property

class OfferResource(resources.ModelResource):
    class Meta:
        model = Offer

class NeedResource(resources.ModelResource):
    class Meta:
        model = Need

class DealResource(resources.ModelResource):
    class Meta:
        model = Deal

# Обновление админ-классов для импорта/экспорта
@admin.register(Client)
class ClientAdmin(ImportExportModelAdmin):
    resource_class = ClientResource
    list_display = ('id','last_name', 'first_name', 'patronymic', 'phone', 'email')
    search_fields = ('last_name', 'first_name', 'patronymic', 'phone', 'email')
    list_filter = ('last_name', 'first_name')
    ordering = ('last_name',)

@admin.register(Realtor)
class RealtorAdmin(ImportExportModelAdmin):
    resource_class = RealtorResource
    list_display = ('id','last_name', 'first_name', 'patronymic', 'commission_share')
    search_fields = ('last_name', 'first_name', 'patronymic')
    list_filter = ('commission_share',)
    ordering = ('last_name',)

@admin.register(Property)
class PropertyAdmin(ImportExportModelAdmin):
    resource_class = PropertyResource
    list_display = (
        'id', 'property_type', 'city', 'street', 'house_number', 'apartment_number', 'latitude', 'longitude', 'area', 'floor', 'rooms', 'floors'
    )
    list_filter = ('property_type', 'city', 'rooms')
    search_fields = ('city', 'street', 'house_number', 'apartment_number')
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
class OfferAdmin(ImportExportModelAdmin):
    resource_class = OfferResource
    list_display = ('id', 'client', 'realtor', 'property', 'price')
    search_fields = ('client__first_name', 'client__last_name', 'realtor__first_name', 'realtor__last_name')
    list_filter = ('property__property_type',)

@admin.register(Need)
class NeedAdmin(ImportExportModelAdmin):
    resource_class = NeedResource
    list_display = ('id', 'client', 'realtor', 'property_type', 'address', 'min_price', 'max_price')
    search_fields = ('client__first_name', 'client__last_name', 'realtor__first_name', 'realtor__last_name', 'address', 'city', 'street', 'house_number', 'apartment_number')
    list_filter = ('property_type',)

@admin.register(Deal)
class DealAdmin(ImportExportModelAdmin):
    resource_class = DealResource
    list_display = ('id', 'need', 'offer')
    search_fields = ('need__client__first_name', 'need__client__last_name', 'offer__client__first_name', 'offer__client__last_name')
    list_filter = ('need__property_type',)


@admin.register(Act)
class Act(ImportExportModelAdmin):
    list_display = ('id', 'date_time','duration','act_type','comment')
    