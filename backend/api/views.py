import datetime, logging
from django.shortcuts import get_object_or_404
from django.utils.timezone import make_aware
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from .utils import generate_formcode
from .serializers import (
    SubmitFormSerializer,
    TechnicianPersonelSerializer,
    TechnicianSubmitSerializer,
    AghlamSerializer,
)
from .models import SubmitForm, TechnicianSubmit, TechnicianPersonel, Aghlam

SECTION_CODES = {
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
    "High Glass": "05",
    "Formalin": "08",
    "Resin": "07",
    "Purification Plant": "04",
    "Agheshte": "03",
}

User = get_user_model()
logger = logging.getLogger(__name__)


def generate_formcode(phase, section_code, problemdate):
    date_str = problemdate.strftime("%m") if problemdate else "00"
    return f"{phase}{section_code}{date_str}"


class SubmitFormDetailByCodeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, formcode):
        submit_form = get_object_or_404(SubmitForm, formcode=formcode)
        serializer = SubmitFormSerializer(submit_form)
        return Response(
            {"form_data": serializer.data, "user_type": request.user.user_type}
        )


class SubmitFormDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        submit_form = get_object_or_404(SubmitForm, pk=pk)
        serializer = SubmitFormSerializer(submit_form)
        return Response(
            {"form_data": serializer.data, "user_type": request.user.user_type}
        )


@api_view(["POST", "GET"])
@permission_classes([AllowAny])
def FormListCreate(request):
    # Extract data from request
    problemdate_str = request.data.get("problemdate", "")
    problemdate = (
        make_aware(datetime.datetime.fromisoformat(problemdate_str))
        if problemdate_str
        else None
    )

    phase = request.data.get("phase", "01")
    machinename = request.data.get("machinename")
    machinecode = request.data.get("machinecode")
    machineplacecode = request.data.get("machineplacecode", "")
    worktype = request.data.get("worktype", "")
    stoptime_str = request.data.get("stoptime", None)
    failuretime = request.data.get("failuretime", None)
    operatorname = request.data.get("operatorname")
    productionstop = request.data.get("productionstop", False)
    section = request.data.get("section", "")
    shift = request.data.get("shift", "")
    suggesttime = request.data.get("suggesttime", None)
    worksuggest = request.data.get("worksuggest", "")
    fixrepair = request.data.get("fixrepair", "")
    reportinspection = request.data.get("reportinspection", "")
    faultdm = request.data.get("faultdm", "")
    problemdescription = request.data.get("problemdescription", "")

    # Convert timestamps
    stoptime = (
        make_aware(datetime.datetime.fromisoformat(stoptime_str))
        if stoptime_str
        else None
    )
    # Validate required fields
    if not machinename or not machinecode or not operatorname or not phase:
        return Response(
            {"status": "error", "message": "Required fields are missing"}, status=400
        )

    section_code = SECTION_CODES.get(section, "01")

    # Generate formcode efficiently
    base_formcode = generate_formcode(phase, section_code, problemdate)
    last_form = (
        SubmitForm.objects.filter(formcode__startswith=base_formcode)
        .order_by("-formcode")
        .first()
    )

    if last_form:
        last_number = int(last_form.formcode[-2:])
        new_last_two = str(last_number + 1).zfill(2)
        if last_number >= 99:
            return Response(
                {"status": "error", "message": "Reached maximum formcode limit"},
                status=400,
            )
        formcode = base_formcode + new_last_two
    else:
        formcode = base_formcode + "01"

    # Save to database
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
        return Response(
            {
                "status": "success",
                "message": "Form submitted successfully",
                "formcode": formcode,
            }
        )
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)


@api_view(["POST", "GET"])
@permission_classes([AllowAny])
def TechnicianFormSubmit(request):
    if request.method == "POST":
        # Extract data from the request
        formcode = request.data.get("formcode")
        failurepart = request.data.get("failurepart", "")
        failuretime_str = request.data.get("failuretime", "")
        sparetime_str = request.data.get("sparetime", "")
        startfailuretime_str = request.data.get("startfailuretime", "")
        problemdescription = request.data.get("problemdescription", "")
        jobstatus = request.data.get("jobstatus", "در حال انجام")
        status = request.data.get("status", "")

        # Convert timestamps to timezone-aware datetime objects
        def parse_datetime(dt_str):
            try:
                return (
                    make_aware(datetime.datetime.fromisoformat(dt_str))
                    if dt_str
                    else None
                )
            except ValueError:
                return None

        failuretime = parse_datetime(failuretime_str)
        sparetime = parse_datetime(sparetime_str)
        startfailuretime = parse_datetime(startfailuretime_str)

        # Validate required fields
        if not failurepart or not failuretime or not sparetime:
            return Response(
                {"status": "error", "message": "Required fields are missing"},
                status=400,
            )

        # Create and save form entry
        try:
            form = SubmitForm.objects.get(formcode=formcode)
            if status == "completed":
                form.technician_submitted = True
                form.technician_status = "reviewed"
            elif status == "not_possible":
                form.technician_status = "returned"

            form.save()

            TechnicianSubmit.objects.create(
                formcode=formcode,
                failurepart=failurepart,
                failuretime=failuretime,
                sparetime=sparetime,
                startfailuretime=startfailuretime,
                problemdescription=problemdescription,
                jobstatus=jobstatus,
                submit_form=form,
            )
            return Response(
                {
                    "status": "success",
                    "message": "Form submitted successfully",
                    "technician_status": form.technician_status,
                }
            )

        except SubmitForm.DoesNotExist:
            return Response(
                {"status": "error", "message": "Form not found"}, status=404
            )
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=500)

    elif request.method == "GET":
        # Retrieve technician submissions and add an activity field
        submissions = TechnicianSubmit.objects.all()

        # Format the response data
        updated_submissions = []
        for form in submissions:
            updated_submissions.append(
                {
                    "formcode": form.formcode,
                    "failurepart": form.failurepart,
                    "failuretime": form.failuretime,
                    "sparetime": form.sparetime,
                    "startfailuretime": form.startfailuretime,
                    "problemdescription": form.problemdescription,
                    "jobstatus": form.jobstatus,
                    "activity": (
                        "کار انجام شد"
                        if form.jobstatus == "بله"
                        else (
                            "کار انجام نشد"
                            if form.jobstatus == "خیر"
                            else "در حال انجام"
                        )
                    ),
                }
            )

        return Response({"status": "success", "data": updated_submissions})


@api_view(["POST", "GET"])
@permission_classes([AllowAny])
def AghlamSubmit(request):
    if request.method == "POST":
        # Extract data
        formcode = request.data.get("formcode")
        kalaname = request.data.get("kalaname")
        countkala = request.data.get("countkala")
        vahedkala = request.data.get("vahedkala")
        codekala = request.data.get("codekala")
        flamekala = request.data.get("flamekala")
        shopkala = request.data.get("shopkala")

        # Validate required fields
        if not kalaname or not countkala or not vahedkala:
            return Response(
                {"status": "error", "message": "Required fields are missing"},
                status=400,
            )
        # Create and save form entry
        try:
            Aghlam.objects.create(
                formcode=formcode,
                kalaname=kalaname,
                countkala=countkala,
                vahedkala=vahedkala,
                codekala=codekala,
                flamekala=flamekala,
                shopkala=shopkala,
            )
            return Response(
                {"status": "success", "message": "Form submitted successfully"}
            )
        except Exception as e:
            # Log the error and return it in the response
            print(f"Error saving Aghlam: {e}")
            return Response({"status": "error", "message": str(e)}, status=500)

    elif request.method == "GET":
        submissions = Aghlam.objects.all().values()
        return Response({"status": "success", "data": list(submissions)})


@api_view(["POST", "GET"])
@permission_classes([AllowAny])
def PersonelSubmit(request):
    if request.method == "POST":
        # Extract data
        formcode = request.data.get("formcode", "")
        personel = request.data.get("personel", "")
        personelnumber = request.data.get("personelnumber", "")
        datesubmit = request.data.get("datesubmit", "")
        specialjob = request.data.get("specialjob", "")
        starttimerepair = request.data.get("starttimerepair", "")
        endtimerepair = request.data.get("endtimerepair", "")
        repairstatus = request.data.get("repairstatus", "")
        unitrepair = request.data.get("unitrepair", "")
        shift = request.data.get("shift", "")
        delayreason = request.data.get("delayreason", "")
        failurereason = request.data.get("failurereason", "")
        failurereasondescription = request.data.get("failurereasondescription", "")
        suggestionfailure = request.data.get("suggestionfailure", "")
        submit_form = request.data.get("submit_form")

        # Validate required fields
        if not personel or not personelnumber:
            return Response(
                {"status": "error", "message": "Required fields are missing"},
                status=400,
            )

        def parse_datetime(dt_str):
            try:
                return (
                    make_aware(datetime.datetime.fromisoformat(dt_str))
                    if dt_str
                    else None
                )
            except ValueError:
                return None  # Invalid date format

        datesubmit = parse_datetime(datesubmit)
        starttimerepair = parse_datetime(starttimerepair)
        endtimerepair = parse_datetime(endtimerepair)

        # Create and save form entry
        try:
            TechnicianPersonel.objects.create(
                formcode=formcode,
                personel=personel,
                personelnumber=personelnumber,
                datesubmit=datesubmit,
                specialjob=specialjob,
                starttimerepair=starttimerepair,
                endtimerepair=endtimerepair,
                repairstatus=repairstatus,
                unitrepair=unitrepair,
                shift=shift,
                delayreason=delayreason,
                failurereason=failurereason,
                failurereasondescription=failurereasondescription,
                suggestionfailure=suggestionfailure,
                submit_form=submit_form,
            )
            return Response(
                {"status": "success", "message": "Form submitted successfully"}
            )
        except Exception as e:
            # Log the error and return it in the response
            print(f"Error saving Personels: {e}")
            return Response({"status": "error", "message": str(e)}, status=500)

    elif request.method == "GET":
        submissions = TechnicianPersonel.objects.all().values()
        return Response({"status": "success", "data": list(submissions)})


class SubmitFormListView(APIView):
    permission_classes = [
        AllowAny
    ]  # This allows access to all users, authenticated or not

    def get(self, request):
        forms = SubmitForm.objects.all()
        serializer = SubmitFormSerializer(forms, many=True)
        return Response(serializer.data)


class TechnicianFormListView(APIView):
    permission_classes = [
        AllowAny
    ]  # This allows access to all users, authenticated or not

    def get(self, request):
        forms = TechnicianSubmit.objects.all()
        serializer = TechnicianSubmitSerializer(forms, many=True)
        return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_form(request, pk):
    try:
        form = get_object_or_404(SubmitForm, pk=pk)

        # Logging before deletion (for debugging)
        logger.info(f"Deleting SubmitForm ID: {pk}")

        # Delete related records explicitly (not required if CASCADE is set, but ensures cleanup)
        deleted_technicians = TechnicianPersonel.objects.filter(
            submit_form=form
        ).delete()
        deleted_aghlams = Aghlam.objects.filter(submit_form=form).delete()
        deleted_technician_submits = TechnicianSubmit.objects.filter(
            submit_form=form
        ).delete()

        logger.info(f"Deleted related TechnicianPersonel: {deleted_technicians}")
        logger.info(f"Deleted related Aghlam: {deleted_aghlams}")
        logger.info(f"Deleted related TechnicianSubmit: {deleted_technician_submits}")

        # Now delete the SubmitForm itself
        form.delete()

        return Response(
            {"message": "Form and related records deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )

    except SubmitForm.DoesNotExist:
        return Response({"error": "Form not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        logger.error(f"Error deleting form {pk}: {str(e)}")
        return Response(
            {"error": "Internal Server Error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class IsPm(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(name="pm").exists()
        )


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
    user = authenticate(request, username=username, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user_type": user.user_type})
    else:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
        )


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
        username=username, user_type=user_type, password=make_password(password)
    )
    user.save()

    # Generate a token for the new user
    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "status": "success",
            "message": "User registered successfully",
            "token": token.key,
        }
    )
