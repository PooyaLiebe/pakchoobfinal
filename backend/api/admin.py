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
        "formcode",
        "failurepart",
        "failuretime",
        "sparetime",
        "startfailuretime",
        "problemdescription",
        "jobstatus",
        "submit_form",
    ]


class AdminAghlam(admin.ModelAdmin):
    list_display = [
        "formcode",
        "kalaname",
        "countkala",
        "vahedkala",
        "codekala",
        "flamekala",
        "shopkala",
        "submit_form",
    ]


class AdminPersonel(admin.ModelAdmin):
    list_display = [
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


class LoginUserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "password", "user_type"]
    list_editable = ["user_type", "password"]


admin.site.register(LoginUser, LoginUserAdmin)
admin.site.register(Aghlam, AdminAghlam)
admin.site.register(SubmitForm, AdminSubmitForm)
admin.site.register(TechnicianSubmit, AdminTechnicianForm)
admin.site.register(TechnicianPersonel, AdminPersonel)
