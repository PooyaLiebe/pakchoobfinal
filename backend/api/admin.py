from django.contrib import admin
from .models import LoginUser

# Register your models here.


class LoginUserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "password", "user_type"]
    list_editable = ["user_type"]


admin.site.register(LoginUser, LoginUserAdmin)
