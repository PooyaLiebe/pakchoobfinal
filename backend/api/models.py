from django.db import models
from django.contrib.auth.models import AbstractUser, User

# Create your models here.


class LoginUser(AbstractUser):
    USER_TYPE_CHOICE = (
        ("pm", "Pm"),
        ("mechanic", "Mechanic"),
        ("production", "Production"),
        ("utility", "Utility"),
        ("metalworking", "Metalworking"),
        ("electric", "Electric"),
        ("tarashkari", "Tarashkari"),
    )
    user_type = models.CharField(max_length=50, choices=USER_TYPE_CHOICE, default="pm")


def __str__(self):
    return f"{self.username} ({self.user_type})"


class SubmitForm(models.Model):
    formcode = models.CharField(max_length=100,null=True)
    problemdate = models.DateTimeField(
        null=True
    )  # Changed to DateTimeField for user input
    machinename = models.CharField(max_length=100, null=True)
    machinecode = models.CharField(max_length=100, null=True)
    machineplacecode = models.CharField(max_length=100, default="MDF1")
    worktype = models.CharField(max_length=20, default="mechanic")
    stoptime = models.DateTimeField(null=True)  # Removed auto_now_add
    failuretime = models.CharField(max_length=20, null=True)  # Removed auto_now_add
    operatorname = models.CharField(max_length=100, null=True)
    productionstop = models.CharField(max_length=100, null=True)
    section = models.CharField(max_length=100, null=True)
    shift = models.CharField(max_length=100, null=True)
    suggesttime = models.CharField(max_length=30, null=True)  # Removed auto_now_add
    worksuggest = models.CharField(max_length=100, null=True)
    fixrepair = models.CharField(max_length=100, null=True)
    reportinspection = models.CharField(max_length=100, null=True)  # Typo fixed
    faultdm = models.CharField(max_length=100, null=True)
    problemdescription = models.TextField(blank=True, null=True)  # No changes needed

    def __str__(self):
        return self.formcode
