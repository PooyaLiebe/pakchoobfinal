# Generated by Django 5.1.6 on 2025-03-27 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_aghlam_technicianpersonel_techniciansubmit'),
    ]

    operations = [
        migrations.AddField(
            model_name='techniciansubmit',
            name='formcode',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
