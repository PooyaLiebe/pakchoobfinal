from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class LoginUser(AbstractUser):
    USER_TYPE_CHOICE = (
        ("admin", "Admin"),
        ("operator", "Operator"),
        ("technician", "Technician"),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICE)

    def __str__(self):
        return f"{self.username({self.user_type})}"
