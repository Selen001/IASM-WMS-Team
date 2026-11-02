
from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "enrollment_number",
        "first_name",
        "last_name",
        "school",
        "admission_date",
        "enrollment_status",
    )
    search_fields = (
        "enrollment_number",
        "first_name",
        "last_name",
    )
    list_filter = ("school", "enrollment_status")
    list_select_related = ("school",)
