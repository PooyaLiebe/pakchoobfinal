from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SubmitForm, TechnicianSubmit, TechnicianPersonel, Aghlam


class SubmitFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmitForm
        fields = "__all__"


class TechnicianSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicianSubmit
        fields = "__all__"


class TechnicianPersonelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicianPersonel
        fields = "__all__"


class AghlamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aghlam
        fields = "__all__"
