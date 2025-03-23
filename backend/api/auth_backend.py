from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class LoginUserBackend(ModelBackend):
    def authenticate(
        self, request, username=None, password=None, user_type=None, **kwargs
    ):
        try:
            user = UserModel.objects.get(username=username)
            if user.check_password(password) and user.user_type == user_type:
                return user
        except UserModel.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
