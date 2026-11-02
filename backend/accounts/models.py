
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        SYSTEM_ADMIN = "SYSTEM_ADMIN", "System Administrator"
        DEPARTMENT_OFFICER = "DEPARTMENT_OFFICER", "Department Officer"
        PRINCIPAL = "PRINCIPAL", "School Principal"
        SCHOOL_STAFF = "SCHOOL_STAFF", "School Staff"
        HEALTH_WELFARE_STAFF = "HEALTH_WELFARE_STAFF", "Health / Welfare Staff"

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.SCHOOL_STAFF,
    )

    district = models.ForeignKey(
        "schools.District",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="users",
    )

    school = models.ForeignKey(
        "schools.School",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="users",
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
