import django_filters
from .models import Property

class PropertyFilter(django_filters.FilterSet):
    city = django_filters.CharFilter(lookup_expr='icontains')
    street = django_filters.CharFilter(lookup_expr='icontains')
    property_type = django_filters.ChoiceFilter(choices=Property.PROPERTY_TYPE_CHOICES)

    class Meta:
        model = Property
        fields = ['city', 'street', 'property_type']
