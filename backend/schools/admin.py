
from django.contrib import admin
from .models import District, School


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "state", "is_active")
    search_fields = ("name", "code")
    list_filter = ("state", "is_active")


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ("name", "school_code", "district", "is_active")
    search_fields = ("name", "school_code", "district__name")
    list_filter = ("district", "is_active")
