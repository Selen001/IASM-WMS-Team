
from rest_framework import serializers
from .models import School


class SchoolSerializer(serializers.ModelSerializer):
    district_name = serializers.CharField(
        source="district.name",
        read_only=True,
    )

    class Meta:
        model = School
        fields = [
            "id",
            "name",
            "school_code",
            "district",
            "district_name",
            "address",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
