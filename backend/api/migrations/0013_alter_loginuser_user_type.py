# Generated by Django 5.1.6 on 2025-03-24 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_submitform_worktype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loginuser',
            name='user_type',
            field=models.CharField(choices=[('pm', 'Pm'), ('mechanic', 'Mechanic'), ('production', 'Production'), ('utility', 'Utility'), ('metalworking', 'Metalworking'), ('electric', 'Electric'), ('tarashkari', 'Tarashkari')], max_length=50),
        ),
    ]
