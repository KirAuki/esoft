# Generated by Django 5.1.3 on 2024-12-16 15:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_property_images_property_photo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='property',
            name='photo',
        ),
    ]
