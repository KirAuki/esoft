# Generated by Django 5.1.3 on 2024-12-16 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_act_act_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='images',
            field=models.ImageField(blank=True, null=True, upload_to='property_images/', verbose_name='Фотографии'),
        ),
    ]
