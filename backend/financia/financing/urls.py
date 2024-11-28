from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FinancingViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'financings', FinancingViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]