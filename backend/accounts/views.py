
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from schools.models import School

User = get_user_model()


class RegistrationSchoolListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        schools = School.objects.filter(
            is_active=True,
            district__is_active=True
        ).select_related("district").order_by("name")

        data = [
            {
                "id": school.id,
                "name": school.name,
                "school_code": school.school_code,
                "district": school.district.name,
            }
            for school in schools
        ]

        return Response(data)


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        full_name = request.data.get("full_name", "").strip()
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")
        confirm_password = request.data.get("confirm_password", "")
        school_id = request.data.get("school_id")

        if not all([
            full_name,
            email,
            password,
            confirm_password,
            school_id,
        ]):
            return Response(
                {"error": "Please complete all required fields."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password != confirm_password:
            return Response(
                {"error": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {"error": "An account with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            school = School.objects.get(
                id=school_id,
                is_active=True,
                district__is_active=True,
            )
        except (School.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Please select a valid active school."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        name_parts = full_name.split(maxsplit=1)

        temporary_user = User(
            username=email,
            email=email,
            first_name=name_parts[0],
            last_name=name_parts[1] if len(name_parts) > 1 else "",
        )

        try:
            validate_password(password, user=temporary_user)
        except ValidationError as error:
            return Response(
                {"error": list(error.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name_parts[0],
                last_name=name_parts[1] if len(name_parts) > 1 else "",
                role=User.Role.SCHOOL_STAFF,
                school=school,
                district=school.district,
                is_active=False,
            )

        return Response(
            {
                "message": (
                    "Registration submitted successfully. "
                    "Your account is awaiting administrator approval."
                ),
                "status": "pending_approval",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email).first()

        if user is None or not user.check_password(password):
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {
                    "error": (
                        "Your account is awaiting administrator approval."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        authenticated_user = authenticate(
            request,
            username=user.username,
            password=password,
        )

        if authenticated_user is None:
            return Response(
                {"error": "Unable to authenticate this account."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(
            user=authenticated_user
        )

        return Response(
            {
                "message": "Login successful.",
                "token": token.key,
                "user": {
                    "id": authenticated_user.id,
                    "username": authenticated_user.username,
                    "full_name": authenticated_user.get_full_name(),
                    "email": authenticated_user.email,
                    "role": authenticated_user.role,
                    "role_display": authenticated_user.get_role_display(),
                    "school_id": authenticated_user.school_id,
                    "district_id": authenticated_user.district_id,
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()

        return Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "full_name": user.get_full_name(),
                "email": user.email,
                "role": user.role,
                "role_display": user.get_role_display(),
                "school_id": user.school_id,
                "district_id": user.district_id,
            }
        )
