import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from .models import CreditScore

@pytest.fixture
def user(db):
    return User.objects.create_user(username='testuser', password='testpassword')

@pytest.fixture
def api_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client

@pytest.fixture
def credit_score(user):
    return CreditScore.objects.create(
        user=user,
        income="40000.00",
        credit_history=True
    )

@pytest.mark.django_db
def test_list_credit_scores(api_client, credit_score):
    response = api_client.get('/api/v1/credit-scores/')
    assert response.status_code == 200
    assert len(response.data) == 1

@pytest.mark.django_db
def test_create_credit_score(api_client):
    data = {"income": "50000.00", "credit_history": True}
    response = api_client.post('/api/v1/credit-scores/', data)
    assert response.status_code == 201
    assert response.data['income'] == "50000.00"

@pytest.mark.django_db
def test_calculate_credit_score(api_client, credit_score):
    response = api_client.post(f'/api/v1/credit-scores/{credit_score.id}/calculate/')
    assert response.status_code == 200
    assert "score" in response.data
