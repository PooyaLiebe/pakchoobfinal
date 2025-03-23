import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login, get_user_model
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password


User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user_type": user.user_type})
    else:
        return Response({"error": "Invalid credentials"}, status=400)


# def login_view(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         username = data.get("username")
#         password = data.get("password")
#         user_type = data.get("user_type")

#         user = authenticate(
#             request, username=username, password=password, user_type=user_type
#         )
#         if user is not None:
#             login(request, user)
#             return JsonResponse({"status": "Success", "user_type": user.user_type})
#         else:
#             return JsonResponse(
#                 {"status": "error", "message": "Invalid Credentials"}, status=401
#             )


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user_type = request.data.get("user_type")

    if not username or not password or not user_type:
        return Response(
            {"status": "error", "message": "All fields are required"}, status=400
        )

    if user_type not in ["operator", "technician", "admin"]:
        return Response({"status": "error", "message": "Invalid user type"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response(
            {"status": "error", "message": "Username already exists"}, status=400
        )

    user = User(
        username=username, password=make_password(password), user_type=user_type
    )
    user.save()

    # Generate a token for the new user
    token, created = Token.objects.get_or_create(user=user)

    return Response(
        {
            "status": "success",
            "message": "User registered successfully",
            "token": token.key,
        }
    )
