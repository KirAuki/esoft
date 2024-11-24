from django.contrib import admin
from .models import User,Property, Apartment, House, Land

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'patronymic', 'phone', 'email', 'user_type', 'commission_share')
    search_fields = ('last_name', 'first_name', 'patronymic', 'phone', 'email')
    list_filter = ('user_type', 'commission_share')

admin.site.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('property_type', 'address', 'city', 'street', 'house_number', 'apartment_number', 'latitude', 'longitude')
    list_filter = ('property_type', 'city', 'street')
    search_fields = ('city', 'street', 'house_number', 'apartment_number')
    ordering = ('city', 'street', 'house_number')

admin.site.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ('address', 'floor', 'rooms', 'area')
    list_filter = ('floor', 'rooms')
    search_fields = ('city', 'street', 'house_number', 'apartment_number')

admin.site.register(House)
class HouseAdmin(admin.ModelAdmin):
    list_display = ('address', 'floors', 'rooms', 'area')
    list_filter = ('floors', 'rooms')
    search_fields = ('city', 'street', 'house_number')

admin.site.register(Land)
class LandAdmin(admin.ModelAdmin):
    list_display = ('address', 'area')
    search_fields = ('city', 'street', 'house_number', 'apartment_number')




