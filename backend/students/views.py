
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Student
from .serializers import StudentSerializer


class StudentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Student.objects.select_related("school")

        if user.role == "SYSTEM_ADMIN":
            return queryset

        if user.role == "DEPARTMENT_OFFICER":
            if not user.district_id:
                return Student.objects.none()

            return queryset.filter(school__district_id=user.district_id)

        if user.role in [
            "PRINCIPAL",
            "SCHOOL_STAFF",
            "HEALTH_WELFARE_STAFF",
        ]:
            if not user.school_id:
                return Student.objects.none()

            return queryset.filter(school_id=user.school_id)

        return Student.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        if user.role == "SYSTEM_ADMIN":
            serializer.save()
            return

        if user.role in [
            "PRINCIPAL",
            "SCHOOL_STAFF",
        ]:
            if not user.school_id:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied(
                    "Your account is not assigned to a school."
                )

            serializer.save(school_id=user.school_id)
            return

        from rest_framework.exceptions import PermissionDenied
        raise PermissionDenied(
            "You do not have permission to register students."
        )
