
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import School
from .serializers import SchoolSerializer


class SchoolListAPIView(generics.ListAPIView):
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = School.objects.filter(is_active=True)

        if user.role == "SYSTEM_ADMIN":
            return School.objects.all()

        if user.role == "DEPARTMENT_OFFICER":
            if not user.district_id:
                return School.objects.none()

            return queryset.filter(district_id=user.district_id)

        if user.role in ["PRINCIPAL", "SCHOOL_STAFF", "HEALTH_WELFARE_STAFF"]:
            if not user.school_id:
                return School.objects.none()

            return queryset.filter(id=user.school_id)

        return School.objects.none()
