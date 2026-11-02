
from django.db import models


class Student(models.Model):
    class EnrollmentStatus(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        TRANSFERRED = "TRANSFERRED", "Transferred"
        GRADUATED = "GRADUATED", "Graduated"
        INACTIVE = "INACTIVE", "Inactive"

    school = models.ForeignKey(
        "schools.School",
        on_delete=models.PROTECT,
        related_name="students",
    )

    enrollment_number = models.CharField(
        max_length=30,
        unique=True,
    )

    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)

    date_of_birth = models.DateField()
    admission_date = models.DateField()

    enrollment_status = models.CharField(
        max_length=20,
        choices=EnrollmentStatus.choices,
        default=EnrollmentStatus.ACTIVE,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.enrollment_number} - {self.first_name} {self.last_name}"
