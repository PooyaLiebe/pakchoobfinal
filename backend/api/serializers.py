from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SubmitForm


class SubmitFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmitForm
        fields = '__all__'

