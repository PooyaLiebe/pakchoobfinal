import datetime
from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from django.contrib.auth import authenticate, login, get_user_model
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.hashers import make_password
from .serializers import SubmitFormSerializer
from .models import SubmitForm

SECTION_CODES= {
    # MDF-2
  "Chipper": "01",
  "Conveyor Line": "02",
  "Dryer & Air Grader": "03",
  "Refiner": "04",
  "Before Press": "05",
  "Press": "06",
  "After Press": "07",
  "Sanding": "09",
  "Cooling System": "08",
  "Steam Boiler": "10",
  "General": "11",
  # MDF-1
  "Melamine": "01",
  "High Glass": '05',
  "Formalin": '08',
  'Resin': '07',
  'Purification Plant': '04',
  'Agheshte': "03"
};

User = get_user_model()

def generate_formcode(phase, section_code, problemdate):
    """Generate a unique form code based on phase, section code, and date."""
    date_str = problemdate.strftime("%m")  # Format date as month
    base_code = f"{phase}{section_code}{date_str}"
    return base_code

class SubmitFormDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        submit_form = get_object_or_404(SubmitForm, pk=pk)
        serializer = SubmitFormSerializer(submit_form)
        return Response(
            {"form_data": serializer.data, "user_type": request.user.user_type}
        )

@api_view(["POST", "GET"])
@permission_classes([AllowAny])
def FormListCreate(request):
    # Extract data from the request
    problemdate = request.data.get("problemdate")
    phase = request.data.get("phase")
    machinename = request.data.get("machinename")
    machinecode = request.data.get("machinecode")
    machineplacecode = request.data.get("machineplacecode")
    worktype = request.data.get("worktype")
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
    if not machinename or not machinecode or not operatorname:
        return Response(
            {"status": "error", "message": "Required fields are missing"},
            status=400,
        )

    # Parse problemdate and stoptime into datetime (example for validation)

    section_code = SECTION_CODES.get(section)
    if not section_code:
        return Response(
            {"status": "error", "message": "Invalid section name"},
            status=400,
        )

    try:
        problemdate = datetime.datetime.fromisoformat(problemdate) if problemdate else None
        stoptime = stoptime if stoptime else None
    except ValueError:
        return Response(
            {"status": "error", "message": "Invalid date format"}, status=400
        )

    # 1. Generate the initial formcode
    base_formcode = generate_formcode(phase, section_code, problemdate)
    formcode = base_formcode + "01"  # Start with 01

    # 2. Check for existing formcode and increment
    while SubmitForm.objects.filter(formcode=formcode).exists():
        last_two = int(formcode[-2:])
        new_last_two = str(last_two + 1).zfill(2)
        if last_two >= 99:
            return Response(
                {"status": "error", "message": "Reached maximum form code number"},
                status=400,
            )  # or modify the base_formcode
        formcode = formcode[:-2] + new_last_two

    # Save form submission to the database
    try:
        form = SubmitForm.objects.create(
            formcode=formcode,
            problemdate=problemdate,
            phase=phase,
            machinename=machinename,
            machinecode=machinecode,
            machineplacecode=machineplacecode,
            worktype=worktype,
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
        return Response(
            {
                "status": "success",
                "message": "Form submitted successfully",
                "formcode": formcode,  # IMPORTANT: Return the generated formcode
            }
        )
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)


class SubmitFormListView(APIView):
    permission_classes = [
        AllowAny
    ]  # This allows access to all users, authenticated or not

    def get(self, request):
        forms = SubmitForm.objects.all()
        serializer = SubmitFormSerializer(forms, many=True)
        return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_form(request, pk):
    try:
        form = SubmitForm.objects.get(pk=pk)
    except SubmitForm.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    form.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class IsPm(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return request.user.group.filter(name="pm").exists()


class FormDelete(generics.DestroyAPIView):
    queryset = SubmitForm.objects.all()
    serializer_class = SubmitFormSerializer
    permission_classes = [AllowAny]


class SendDataView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_type = request.data.get("user_type")
            form_data = request.data.get("form_data")

            if not user_type:
                return Response(
                    {"error": "User type is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )


            if user_type == "mechanic":
                pass
            elif user_type == "electric":
                pass
            elif user_type == "production":
                pass
            elif user_type == "utility":
                pass
            elif user_type == "tarashkari":
                pass
            else:
                return Response(
                    {"error": "Invalid user type."}, status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {"message": "Data sent successfully."}, status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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

    if user_type not in [
        "pm",
        "mechanic",
        "electric",
        "utility",
        "production",
        "metalworking",
        "tarashkari",
    ]:
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

