from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FinancingViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'financings', FinancingViewSet, basename='financing')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]
