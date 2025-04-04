from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SubmitForm, TechnicianSubmit, Personel, Aghlam


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
        fields = [
            "id",
            "submit_form",
            "formcode",
            "failurepart",
            "failuretime",
            "sparetime",
            "startfailuretime",
            "problemdescription",
            "jobstatus",  # Ensure jobstatus is included
        ]


class PersonelSerializer(serializers.ModelSerializer):
    submit_form = SubmitFormSerializer(read_only=True)

    class Meta:
        model = Personel
        fields = [
            "formcode",
            "personel",
            "personelnumber",
            "datesubmit",
            "specialjob",
            "starttimerepair",
            "endtimerepair",
            "repairstatus",
            "unitrepair",
            "shift",
            "delayreason",
            "failurereason",
            "failurereasondescription",
            "suggestionfailure",
            "submit_form",
        ]


class AghlamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Aghlam
        fields = [
            "formcode",
            "kalaname",
            "countkala",
            "vahedkala",
            "codekala",
            "flamekala",
            "shopkala",
        ]

