# Generated by Django 5.1.6 on 2025-03-29 22:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0037_rename_technicianpersonel_personel'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='aghlam',
            name='submit_form',
        ),
        migrations.RemoveField(
            model_name='personel',
            name='submit_form',
        ),
    ]
