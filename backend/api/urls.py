from django.urls import path
from .views import login_view, register_view, FormListCreate, FormDelete, SubmitFormListView

urlpatterns = [
    path("api/login/", login_view, name="login"),
    path("api/register/", register_view, name="register"),
    path("api/submitform/", FormListCreate, name="submitform"),  # Function-based view
    path("api/submitform/list/", SubmitFormListView.as_view(), name="submitform-list"),  # Class-based view
    path("api/submitform/delete/<int:pk>/", FormDelete.as_view(), name="form-delete"),
]
