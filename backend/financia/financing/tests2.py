from rest_framework.test import APIClient
from django.contrib.auth.models import User
from .models import Financing
import pytest
from decimal import Decimal
from django.utils.timezone import now


@pytest.mark.django_db
def test_create_financing_endpoint():
    user = User.objects.create_user(username="testuser", password="testpassword")
    client = APIClient()
    client.force_authenticate(user=user)

    data = {
        "loan_amount": "10000.00",
        "annual_interest_rate": "10.0",
        "term_months": 12,
        "start_date": now().date(),
        "payment_due_day": 10
    }
    response = client.post("/api/v1/financings/", data, format='json')
    assert response.status_code == 201
    assert response.data['loan_amount'] == "10000.00"


@pytest.mark.django_db
def test_payment_schedule_endpoint():
    user = User.objects.create_user(username="testuser", password="testpassword")
    financing = Financing.objects.create(
        user=user,
        loan_amount=Decimal('10000'),
        annual_interest_rate=Decimal('10.0'),
        term_months=12,
        start_date=now().date(),
        payment_due_day=10
    )
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get(f"/api/v1/financings/{financing.id}/payment_schedule/")
    assert response.status_code == 200
    assert len(response.data) == financing.term_months


@pytest.mark.django_db
def test_van_and_tir_endpoint():
    user = User.objects.create_user(username="testuser", password="testpassword")
    financing = Financing.objects.create(
        user=user,
        loan_amount=Decimal('10000'),
        annual_interest_rate=Decimal('10.0'),
        term_months=12,
        start_date=now().date(),
        payment_due_day=10
    )
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get(f"/api/v1/financings/{financing.id}/van_and_tir/")
    assert response.status_code == 200
    assert "van" in response.data
    assert "tir" in response.data
