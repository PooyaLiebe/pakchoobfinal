# Generated by Django 5.1.6 on 2025-03-26 22:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_submitform_section'),
    ]

    operations = [
        migrations.AlterField(
            model_name='submitform',
            name='machineplacecode',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='submitform',
            name='section',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='submitform',
            name='worktype',
            field=models.CharField(max_length=20),
        ),
    ]
