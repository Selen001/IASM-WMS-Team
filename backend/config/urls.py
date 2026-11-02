
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/accounts/", include("accounts.urls")),
    path("api/schools/", include("schools.urls")),
    path("api/students/", include("students.urls")),

    path("api-auth/", include("rest_framework.urls")),
]
