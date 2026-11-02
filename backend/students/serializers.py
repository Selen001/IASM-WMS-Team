
from datetime import date

from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(
        source="school.name",
        read_only=True,
    )

    class Meta:
        model = Student
        fields = [
            "id",
            "school",
            "school_name",
            "enrollment_number",
            "first_name",
            "middle_name",
            "last_name",
            "date_of_birth",
            "admission_date",
            "enrollment_status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_date_of_birth(self, value):
        if value > date.today():
            raise serializers.ValidationError(
                "Date of birth cannot be in the future."
            )
        return value

    def validate_admission_date(self, value):
        if value > date.today():
            raise serializers.ValidationError(
                "Admission date cannot be in the future."
            )
        return value

    def validate(self, attrs):
        date_of_birth = attrs.get("date_of_birth")
        admission_date = attrs.get("admission_date")

        if self.instance is not None:
            date_of_birth = attrs.get(
                "date_of_birth",
                self.instance.date_of_birth,
            )
            admission_date = attrs.get(
                "admission_date",
                self.instance.admission_date,
            )

        if (
            date_of_birth is not None
            and admission_date is not None
            and admission_date < date_of_birth
        ):
            raise serializers.ValidationError({
                "admission_date": (
                    "Admission date cannot be earlier than date of birth."
                )
            })

        return attrs
