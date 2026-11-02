
from datetime import date

from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from schools.models import District, School
from students.models import Student


class StudentAPITests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.district_a = District.objects.create(
            name="Student Test District A",
            code="STUD-A",
        )
        cls.district_b = District.objects.create(
            name="Student Test District B",
            code="STUD-B",
        )

        cls.school_a = School.objects.create(
            name="Student Test School A",
            school_code="STUD-SCH-A",
            district=cls.district_a,
            is_active=True,
        )
        cls.school_b = School.objects.create(
            name="Student Test School B",
            school_code="STUD-SCH-B",
            district=cls.district_b,
            is_active=True,
        )

        cls.admin = User.objects.create_user(
            username="student_test_admin",
            password="TestPassword!123",
            role=User.Role.SYSTEM_ADMIN,
        )
        cls.officer = User.objects.create_user(
            username="student_test_officer",
            password="TestPassword!123",
            role=User.Role.DEPARTMENT_OFFICER,
            district=cls.district_a,
        )
        cls.staff_a = User.objects.create_user(
            username="student_test_staff_a",
            password="TestPassword!123",
            role=User.Role.SCHOOL_STAFF,
            school=cls.school_a,
        )
        cls.staff_b = User.objects.create_user(
            username="student_test_staff_b",
            password="TestPassword!123",
            role=User.Role.SCHOOL_STAFF,
            school=cls.school_b,
        )
        cls.principal = User.objects.create_user(
            username="student_test_principal",
            password="TestPassword!123",
            role=User.Role.PRINCIPAL,
            school=cls.school_a,
        )
        cls.health_staff = User.objects.create_user(
            username="student_test_health",
            password="TestPassword!123",
            role=User.Role.HEALTH_WELFARE_STAFF,
            school=cls.school_a,
        )

        cls.student_a = Student.objects.create(
            school=cls.school_a,
            enrollment_number="STUD-ENR-001",
            first_name="Aarav",
            middle_name="",
            last_name="Patil",
            date_of_birth=date(2012, 5, 14),
            admission_date=date(2024, 6, 10),
        )
        cls.student_b = Student.objects.create(
            school=cls.school_b,
            enrollment_number="STUD-ENR-002",
            first_name="Anaya",
            middle_name="",
            last_name="Shinde",
            date_of_birth=date(2011, 8, 20),
            admission_date=date(2023, 6, 12),
        )

    def setUp(self):
        self.client = APIClient()

    def list_student_ids(self):
        response = self.client.get("/api/students/")
        self.assertEqual(response.status_code, 200)
        return {student["id"] for student in response.data}

    def valid_payload(self, **overrides):
        payload = {
            "school": self.school_a.id,
            "enrollment_number": "STUD-ENR-NEW",
            "first_name": "Meera",
            "middle_name": "",
            "last_name": "Deshmukh",
            "date_of_birth": "2012-04-15",
            "admission_date": "2025-06-10",
            "enrollment_status": "ACTIVE",
        }
        payload.update(overrides)
        return payload

    def test_anonymous_user_cannot_list_students(self):
        response = self.client.get("/api/students/")
        self.assertIn(response.status_code, [401, 403])

    def test_school_staff_only_sees_students_from_assigned_school(self):
        self.client.force_authenticate(user=self.staff_a)

        self.assertEqual(
            self.list_student_ids(),
            {self.student_a.id},
        )

    def test_department_officer_only_sees_students_in_assigned_district(self):
        self.client.force_authenticate(user=self.officer)

        self.assertEqual(
            self.list_student_ids(),
            {self.student_a.id},
        )

    def test_system_admin_can_see_students_from_all_schools(self):
        self.client.force_authenticate(user=self.admin)

        self.assertEqual(
            self.list_student_ids(),
            {self.student_a.id, self.student_b.id},
        )

    def test_health_staff_can_list_students_but_cannot_create_them(self):
        self.client.force_authenticate(user=self.health_staff)

        self.assertEqual(
            self.list_student_ids(),
            {self.student_a.id},
        )

        response = self.client.post(
            "/api/students/",
            self.valid_payload(),
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_school_staff_can_create_student_for_assigned_school(self):
        self.client.force_authenticate(user=self.staff_a)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            Student.objects.filter(
                enrollment_number="STUD-ENR-NEW",
                school=self.school_a,
            ).exists()
        )

    def test_school_staff_cannot_create_student_for_another_school(self):
        self.client.force_authenticate(user=self.staff_a)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(
                enrollment_number="STUD-ENR-FOREIGN",
                school=self.school_b.id,
            ),
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.data["school"],
            self.school_a.id,
        )
        self.assertFalse(
            Student.objects.filter(
                enrollment_number="STUD-ENR-FOREIGN",
                school=self.school_b,
            ).exists()
        )

    def test_department_officer_cannot_create_student(self):
        self.client.force_authenticate(user=self.officer)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, 403)

    def test_principal_can_create_student_for_assigned_school(self):
        self.client.force_authenticate(user=self.principal)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(
                enrollment_number="STUD-ENR-PRINCIPAL"
            ),
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.data["school"],
            self.school_a.id,
        )

    def test_duplicate_enrollment_number_is_rejected(self):
        self.client.force_authenticate(user=self.staff_a)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(enrollment_number="STUD-ENR-001"),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            Student.objects.filter(
                enrollment_number="STUD-ENR-NEW",
            ).exists()
        )

    def test_missing_required_name_is_rejected(self):
        self.client.force_authenticate(user=self.staff_a)

        payload = self.valid_payload()
        payload.pop("first_name")

        response = self.client.post(
            "/api/students/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_invalid_enrollment_status_is_rejected(self):
        self.client.force_authenticate(user=self.staff_a)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(enrollment_status="UNKNOWN"),
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_invalid_date_format_is_rejected(self):
        self.client.force_authenticate(user=self.staff_a)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(date_of_birth="not-a-date"),
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_future_date_of_birth_is_rejected(self):
        self.client.force_authenticate(user=self.staff_a)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(date_of_birth="2099-01-01"),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("date_of_birth", response.data)

    def test_future_admission_date_is_rejected(self):
        self.client.force_authenticate(user=self.staff_a)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(admission_date="2099-01-01"),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("admission_date", response.data)

    def test_admission_before_birth_is_rejected(self):
        self.client.force_authenticate(user=self.staff_a)

        response = self.client.post(
            "/api/students/",
            self.valid_payload(
                date_of_birth="2012-05-10",
                admission_date="2012-05-09",
            ),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("admission_date", response.data)
