# Generated by Django 5.1.6 on 2025-03-29 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_techniciansubmit_jobstatus'),
    ]

    operations = [
        migrations.AddField(
            model_name='submitform',
            name='jobstatus',
            field=models.CharField(default='بله', max_length=20),
        ),
    ]
