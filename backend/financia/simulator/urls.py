from django.urls import path
from .views import CreditSimulationView

urlpatterns = [
    path('simulate/', CreditSimulationView.as_view(), name='simulate_credit'),
]
