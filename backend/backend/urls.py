from django.contrib import admin
from django.urls import path, include
from api.views import register_view, login_view
urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("api.urls")),
    path("api/login/", login_view, name="login"),
    path("api/register/", register_view, name="register"),
]
