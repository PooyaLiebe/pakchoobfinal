# Generated by Django 5.1.6 on 2025-03-29 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_submitform_jobstatus'),
    ]

    operations = [
        migrations.AlterField(
            model_name='submitform',
            name='jobstatus',
            field=models.CharField(default='', max_length=20),
        ),
    ]
