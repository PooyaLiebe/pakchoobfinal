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
    formcode = models.CharField(max_length=100, null=True)
    problemdate = models.DateTimeField(
        null=True
    )  # Changed to DateTimeField for user input
    machinename = models.CharField(max_length=100, null=True)
    phase = models.CharField(max_length=100, null=True)
    machinecode = models.CharField(max_length=100, null=True)
    machineplacecode = models.CharField(max_length=100)
    worktype = models.CharField(max_length=20)
    stoptime = models.DateTimeField(null=True)
    failuretime = models.TimeField(null=True)
    operatorname = models.CharField(max_length=100, null=True)
    productionstop = models.CharField(max_length=100, null=True)
    section = models.CharField(max_length=100, null=True)
    shift = models.CharField(max_length=100, null=True)
    suggesttime = models.CharField(max_length=30, null=True)
    worksuggest = models.CharField(max_length=100, null=True)
    fixrepair = models.CharField(max_length=100, null=True)
    reportinspection = models.CharField(max_length=100, null=True)
    faultdm = models.CharField(max_length=100, null=True)
    problemdescription = models.TextField(blank=True, null=True)

    # Tracking activity
    operator_submitted = models.BooleanField(default=False)
    technician_submitted = models.BooleanField(default=False)
    technician_status = models.CharField(
        max_length=50,
        choices=[
            ("pending", "درحال انتظار برای ثبت تکنیسین"),
            ("reviewed", "فرم توسط تکنیسین بررسی شد"),
            ("returned", "فرم برگشت داده شد"),
        ],
        default="pending",
    )

    def __str__(self):
        return self.formcode


class TechnicianSubmit(models.Model):
    formcode = models.CharField(max_length=100, null=True)
    failurepart = models.CharField(max_length=50)
    failuretime = models.TimeField(null=True)
    sparetime = models.TimeField(null=True)
    startfailuretime = models.TimeField(null=True)
    problemdescription = models.TextField(blank=True, null=True)
    jobstatus = models.CharField(
        max_length=20,
        choices=[
            ("بله", "کار انجام شد"),
            ("خیر", "کار انجام نشد"),
            ("در حال انجام", "در حال انجام"),
        ],
        default="کار انجام شد",
    )
    submit_form = models.ForeignKey(
        SubmitForm,
        on_delete=models.CASCADE,
        related_name="technician_submits",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"Technician Submit {self.formcode}"


class Aghlam(models.Model):
    formcode = models.CharField(max_length=100, null=True)
    kalaname = models.CharField(max_length=50)
    countkala = models.CharField(max_length=50)
    vahedkala = models.CharField(max_length=50)
    codekala = models.CharField(max_length=50)
    flamekala = models.CharField(max_length=50)
    shopkala = models.CharField(max_length=50)

    def __str__(self):
        return f"Aghlam Submit {self.formcode}"


class Personel(models.Model):
    formcode = models.CharField(max_length=100, null=True)
    personel = models.CharField(max_length=50)
    personelnumber = models.CharField(max_length=50)
    datesubmit = models.DateTimeField(null=True)
    specialjob = models.CharField(max_length=50)
    starttimerepair = models.DateTimeField(null=True)
    endtimerepair = models.DateTimeField(null=True)
    repairstatus = models.CharField(max_length=50)
    unitrepair = models.CharField(max_length=50)
    shift = models.CharField(max_length=50)
    delayreason = models.CharField(max_length=50)
    failurereason = models.CharField(max_length=50)
    failurereasondescription = models.CharField(max_length=50)
    suggestionfailure = models.CharField(max_length=50)
    submit_form = models.ForeignKey(
        SubmitForm,
        on_delete=models.CASCADE,
        related_name="personel",
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"Personel Submit {self.formcode}"
