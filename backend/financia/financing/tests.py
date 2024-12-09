import pytest
from decimal import Decimal
from django.utils.timezone import now
from .models import Financing, Payment
from django.contrib.auth.models import User


@pytest.mark.django_db
def test_financing_monthly_payment():
    user = User.objects.create_user(username="testuser", password="testpassword")
    financing = Financing.objects.create(
        user=user,
        loan_amount=Decimal('10000'),
        annual_interest_rate=Decimal('10.0'),
        term_months=12,
        start_date=now().date(),
        payment_due_day=10
    )
    monthly_payment = financing.calculate_monthly_payment()
    assert monthly_payment > Decimal('0')
    assert monthly_payment < financing.loan_amount


@pytest.mark.django_db
def test_financing_payment_schedule():
    user = User.objects.create_user(username="testuser", password="testpassword")
    financing = Financing.objects.create(
        user=user,
        loan_amount=Decimal('10000'),
        annual_interest_rate=Decimal('10.0'),
        term_months=12,
        start_date=now().date(),
        payment_due_day=10
    )
    schedule = financing.calculate_payment_schedule()
    assert len(schedule) == financing.term_months
    assert schedule[-1]['remaining_balance'] == Decimal('0.00')


@pytest.mark.django_db
def test_payment_creation():
    user = User.objects.create_user(username="testuser", password="testpassword")
    financing = Financing.objects.create(
        user=user,
        loan_amount=Decimal('10000'),
        annual_interest_rate=Decimal('10.0'),
        term_months=12,
        start_date=now().date(),
        payment_due_day=10
    )
    payment = Payment.objects.create(
        financing=financing,
        amount=Decimal('500'),
        payment_date=now().date()
    )
    assert payment.financing == financing
    assert payment.amount == Decimal('500')

