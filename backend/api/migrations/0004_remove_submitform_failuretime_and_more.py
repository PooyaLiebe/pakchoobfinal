# Generated by Django 5.1.6 on 2025-03-23 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_submitform_failuretime_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='submitform',
            name='failuretime',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='faultdm',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='fixrepair',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='machinecode',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='machineplacecode',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='operatorname',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='problemdate',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='problemdescription',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='productionstop',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='reportinspection',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='section',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='shift',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='stoptime',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='suggesttime',
        ),
        migrations.RemoveField(
            model_name='submitform',
            name='worksuggest',
        ),
        migrations.AlterField(
            model_name='submitform',
            name='formcode',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='submitform',
            name='machinename',
            field=models.CharField(max_length=50),
        ),
    ]
