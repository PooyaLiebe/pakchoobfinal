from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SubmitForm, TechnicianSubmit, TechnicianPersonel, Aghlam


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "user_type"]  # Adjust as needed


class SubmitFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmitForm
        fields = "__all__"


class TechnicianSubmitSerializer(serializers.ModelSerializer):
    submit_form = SubmitFormSerializer(read_only=True)

    class Meta:
        model = TechnicianSubmit
        fields = "__all__"


class TechnicianPersonelSerializer(serializers.ModelSerializer):
    submit_form = SubmitFormSerializer(read_only=True)

    class Meta:
        model = TechnicianPersonel
        fields = "__all__"


class AghlamSerializer(serializers.ModelSerializer):
    submit_form = SubmitFormSerializer(read_only=True)

    class Meta:
        model = Aghlam
        fields = "__all__"
