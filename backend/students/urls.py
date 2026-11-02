
from django.urls import path
from .views import StudentListCreateAPIView

urlpatterns = [
    path("", StudentListCreateAPIView.as_view(), name="student-list-create"),
]
