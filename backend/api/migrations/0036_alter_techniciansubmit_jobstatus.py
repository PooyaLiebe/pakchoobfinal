# Generated by Django 5.1.6 on 2025-03-29 22:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_submitform_operator_submitted_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='techniciansubmit',
            name='jobstatus',
            field=models.CharField(choices=[('بله', 'کار انجام شد'), ('خیر', 'کار انجام نشد'), ('در حال انجام', 'در حال انجام')], default='کار انجام شد', max_length=20),
        ),
    ]
