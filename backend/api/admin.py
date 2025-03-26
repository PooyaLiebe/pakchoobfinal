from django.contrib import admin
from .models import LoginUser, SubmitForm, TechnicianSubmit, TechnicianPersonel, Aghlam


# Register your models here.
class AdminSubmitForm(admin.ModelAdmin):
    list_display = [
        "id",
        "formcode",
        "problemdate",
        "phase",
        "productionstop",
        "section",
        "machinename",
        "machinecode",
        "machineplacecode",
        "stoptime",
        "failuretime",
        "shift",
        "suggesttime",
        "worksuggest",
        "fixrepair",
        "reportinspection",
        "faultdm",
        "operatorname",
        "problemdescription",
    ]


class AdminTechnicianForm(admin.ModelAdmin):
    list_display = [
        "failurepart",
        "failuretime",
        "sparetime",
        "startfailuretime",
        "problemdescription",
    ]


class LoginUserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "password", "user_type"]
    list_editable = ["user_type", "password"]


admin.site.register(LoginUser, LoginUserAdmin)
admin.site.register(SubmitForm, AdminSubmitForm)
admin.site.register(TechnicianSubmit, AdminTechnicianForm)
