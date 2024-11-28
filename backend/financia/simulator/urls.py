from django.urls import path
from .views import credit_simulation_api_view

urlpatterns = [
    path('simulate/', credit_simulation_api_view, name='simulate_credit'),
]
