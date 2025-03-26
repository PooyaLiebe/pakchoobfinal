from django.urls import path
from .views import (
    login_view,
    register_view,
    FormListCreate,
    FormDelete,
    SubmitFormListView,
    SendDataView,
    TechnicianFormSubmit,
)

urlpatterns = [
    path("api/login/", login_view, name="login"),
    path("api/register/", register_view, name="register"),
    # Generic Form Submission
    path("api/forms/send", SendDataView.as_view(), name="send_data"),
    path("api/submitform/", FormListCreate, name="submitform"),  # Function-based view
    path("api/submitform/list/", SubmitFormListView.as_view(), name="submitform-list"),
    path("api/submitform/delete/<int:pk>/", FormDelete.as_view(), name="delete_form"),
    
    # Technician Submit Endpoints
    path("api/techniciansubmit/", TechnicianFormSubmit, name="technician_submit"),
]
