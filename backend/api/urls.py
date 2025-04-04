from django.urls import path
from .views import (
    login_view,
    register_view,
    FormListCreate,
    FormDelete,
    SubmitFormListView,
    SendDataView,
    TechnicianFormSubmit,
    SubmitFormDetailView,
    SubmitFormDetailByCodeView,
    TechnicianFormListView,
    AghlamSubmit,
    AghlamsFormListView,
    PersonelSubmit,
    PersonelsFormListView,
)


urlpatterns = [
    path("api/login/", login_view, name="login"),
    path("api/register/", register_view, name="register"),
    # Generic Form Submission
    path("api/forms/send", SendDataView.as_view(), name="send_data"),
    path("api/submitform/", FormListCreate, name="submitform"),  # FBV (no .as_view())
    path("api/submitform/list/", SubmitFormListView.as_view(), name="submitform-list"),
    path(
        "api/submitform/delete/<int:pk>/",
        FormDelete.as_view(),
        name="delete_submit_form",
    ),
    path(
        "api/submitform/<str:formcode>/",
        SubmitFormDetailByCodeView.as_view(),
        name="submitform-detail-by-code",
    ),
    path(
        "api/submitform/detail/<int:pk>/",
        SubmitFormDetailView.as_view(),
        name="submitform-detail",
    ),
    # Technician Submit Endpoints
    path("api/techniciansubmit/", TechnicianFormSubmit, name="techniciansubmit"),
    path(
        "api/techniciansubmit/list/",
        TechnicianFormListView.as_view(),
        name="techniciansubmit-list",
    ),
    path(
        "api/techniciansubmit/delete/<int:pk>/",
        FormDelete.as_view(),
        name="delete_technician_form",
    ),
    # Aghlam Endpoints
    path("api/aghlams/", AghlamSubmit, name="aghlams"),
    path("api/aghlams/list/", AghlamsFormListView.as_view(), name="aghlams-list"),
    # Personel Endpoints
    path("api/personels/", PersonelSubmit, name="personels"),
    path("api/personels/list/", PersonelsFormListView.as_view(), name="personels-list"),
]
