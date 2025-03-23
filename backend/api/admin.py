from django.contrib import admin
from .models import LoginUser, SubmitForm


# Register your models here.
class AdminSubmitForm(admin.ModelAdmin):
    list_display = [
        "id",
        "formcode",
        "problemdate",
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


class LoginUserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "password", "user_type"]
    list_editable = ["user_type", "password"]


admin.site.register(LoginUser, LoginUserAdmin)
admin.site.register(SubmitForm, AdminSubmitForm)
