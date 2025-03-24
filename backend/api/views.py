import json
from django.shortcuts import render
from django.utils.timezone import now
from django.contrib.auth import authenticate, login, get_user_model
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import generics,status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from .serializers import SubmitFormSerializer
from .models import SubmitForm


User = get_user_model()

@api_view(["POST","GET"])
@permission_classes([AllowAny])
def FormListCreate(request):
    # Extract data from the request
    formcode = request.data.get("formcode")
    problemdate = request.data.get("problemdate")
    machinename = request.data.get("machinename")
    machinecode = request.data.get("machinecode")
    machineplacecode = request.data.get("machineplacecode")
    worktype = request.data.get('worktype')
    stoptime = request.data.get("stoptime")
    failuretime = request.data.get("failuretime")
    operatorname = request.data.get("operatorname")
    productionstop = request.data.get("productionstop")
    section = request.data.get("section")
    shift = request.data.get("shift")
    suggesttime = request.data.get("suggesttime")
    worksuggest = request.data.get("worksuggest")
    fixrepair = request.data.get("fixrepair")
    reportinspection = request.data.get("reportinspection")
    faultdm = request.data.get("faultdm")
    problemdescription = request.data.get("problemdescription")

    # Validate required fields
    if not formcode or not machinename or not machinecode or not operatorname:
        return Response(
            {"status": "error", "message": "Required fields are missing"}, status=400
        )

    # Parse problemdate and stoptime into datetime (example for validation)
    try:
        problemdate = problemdate if problemdate else None
        stoptime = stoptime if stoptime else None
    except ValueError:
        return Response({"status": "error", "message": "Invalid date format"}, status=400)

    # Save form submission to the database
    try:
        form = SubmitForm.objects.create(
            formcode=formcode,
            problemdate=problemdate,
            machinename=machinename,
            machinecode=machinecode,
            machineplacecode=machineplacecode,
            worktype = worktype,
            stoptime=stoptime,
            failuretime=failuretime,
            operatorname=operatorname,
            productionstop=productionstop,
            section=section,
            shift=shift,
            suggesttime=suggesttime,
            worksuggest=worksuggest,
            fixrepair=fixrepair,
            reportinspection=reportinspection,
            faultdm=faultdm,
            problemdescription=problemdescription,
        )
        form.save()
        return Response({"status": "success", "message": "Form submitted successfully"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

class SubmitFormListView(APIView):
    permission_classes = [AllowAny]  # This allows access to all users, authenticated or not
    def get(self, request):
        forms = SubmitForm.objects.all()
        serializer = SubmitFormSerializer(forms, many=True)
        return Response(serializer.data)

class FormDelete(generics.DestroyAPIView):
    serializer_class = SubmitFormSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print('Authenticated user:', user)
        return SubmitForm.objects.filter(author=user)



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

    if user_type not in ["pm", "mechanic", "electric",'utility','production','metalworking']:
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

