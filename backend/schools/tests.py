
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from schools.models import District, School


class SchoolAccessTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.district_a = District.objects.create(
            name="Test District A",
            code="TEST-A",
        )
        cls.district_b = District.objects.create(
            name="Test District B",
            code="TEST-B",
        )

        cls.school_a = School.objects.create(
            name="Test Ashram School A",
            school_code="TEST-SCH-A",
            district=cls.district_a,
            is_active=True,
        )
        cls.school_b = School.objects.create(
            name="Test Ashram School B",
            school_code="TEST-SCH-B",
            district=cls.district_b,
            is_active=True,
        )

        cls.inactive_school = School.objects.create(
            name="Inactive Test School",
            school_code="TEST-SCH-INACTIVE",
            district=cls.district_a,
            is_active=False,
        )

        cls.officer = User.objects.create_user(
            username="test_officer",
            password="TestPassword!482",
            role=User.Role.DEPARTMENT_OFFICER,
            district=cls.district_a,
        )

        cls.school_staff = User.objects.create_user(
            username="test_staff",
            password="TestPassword!583",
            role=User.Role.SCHOOL_STAFF,
            school=cls.school_a,
        )

        cls.admin = User.objects.create_user(
            username="test_admin",
            password="TestPassword!684",
            role=User.Role.SYSTEM_ADMIN,
        )

    def setUp(self):
        self.client = APIClient()

    def get_school_ids(self):
        response = self.client.get("/api/schools/")
        self.assertEqual(response.status_code, 200)
        return {school["id"] for school in response.data}

    def test_anonymous_user_cannot_list_schools(self):
        response = self.client.get("/api/schools/")
        self.assertEqual(response.status_code, 403)

    def test_department_officer_only_sees_active_schools_in_assigned_district(self):
        self.client.force_authenticate(user=self.officer)

        self.assertEqual(
            self.get_school_ids(),
            {self.school_a.id},
        )

    def test_school_staff_only_sees_their_assigned_school(self):
        self.client.force_authenticate(user=self.school_staff)

        self.assertEqual(
            self.get_school_ids(),
            {self.school_a.id},
        )

    def test_system_admin_can_see_all_schools(self):
        self.client.force_authenticate(user=self.admin)

        self.assertEqual(
            self.get_school_ids(),
            {
                self.school_a.id,
                self.school_b.id,
                self.inactive_school.id,
            },
        )

    def test_officer_without_district_sees_no_schools(self):
        officer = User.objects.create_user(
            username="officer_without_district",
            password="TestPassword!785",
            role=User.Role.DEPARTMENT_OFFICER,
        )
        self.client.force_authenticate(user=officer)

        self.assertEqual(self.get_school_ids(), set())
