
from django.db import models


class District(models.Model):
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=100, default="Maharashtra")
    code = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class School(models.Model):
    name = models.CharField(max_length=200)
    school_code = models.CharField(max_length=30, unique=True)
    district = models.ForeignKey(
        District,
        on_delete=models.PROTECT,
        related_name="schools",
    )
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.school_code})"
