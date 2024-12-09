from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Financing, Payment
from .serializers import FinancingSerializer, PaymentSerializer, serializers
from decimal import Decimal

class FinancingViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar financiamientos.
    """
    queryset = Financing.objects.all()
    serializer_class = FinancingSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Crea un nuevo financiamiento para el usuario autenticado.",
        request_body=FinancingSerializer,
        responses={
            201: FinancingSerializer,
            400: "Error de validación en los datos del financiamiento."
        }
    )

    def perform_create(self, serializer):
        """
        Asocia el usuario actual al financiamiento al crearlo.
        """
        if serializer.validated_data['loan_amount'] <= 0:
            raise serializers.ValidationError("El monto del préstamo debe ser mayor a 0.")
        if serializer.validated_data['annual_interest_rate'] <= 0:
            raise serializers.ValidationError("La tasa de interés debe ser mayor a 0.")

        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Obtiene el calendario de pagos para un financiamiento específico.",
        responses={
            200: openapi.Response(
                description="Calendario de pagos generado exitosamente.",
                examples={
                    "application/json": [
                        {
                            "month": 1,
                            "monthly_payment": "856.07",
                            "interest_payment": "100.00",
                            "principal_payment": "756.07",
                            "remaining_balance": "9243.93"
                        },
                    ]
                }
            )
        }
    )
    @action(detail=True, methods=['get'])
    def payment_schedule(self, request, pk=None):
        """
        Endpoint para obtener el calendario de pagos de un financiamiento.
        """
        financing = self.get_object()
        schedule = financing.calculate_payment_schedule()
        return Response(schedule, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Calcula el VAN y la TIR para un financiamiento.",
        responses={
            200: openapi.Response(
                description="Cálculo exitoso de VAN y TIR.",
                examples={
                    "application/json": {
                        "van": "325.87",
                        "tir": "12.34"
                    }
                }
            )
        }
    )
    @action(detail=True, methods=['get'])
    def van_and_tir(self, request, pk=None):
        """
        Endpoint para calcular el VAN y la TIR de un financiamiento.
        """
        financing = self.get_object()
        cash_flows = [-financing.loan_amount] + [financing.calculate_monthly_payment()] * financing.term_months

        if not all(isinstance(x, (int, float, Decimal)) and x >= 0 for x in cash_flows[1:]):
            return Response(
                {"error": "Flujos de efectivo inválidos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        discount_rate = Decimal('0.10') / Decimal('12')  # 10% anual convertido a mensual
        van_tir = financing.calculate_van_and_tir(cash_flows, discount_rate)
        return Response(van_tir, status=status.HTTP_200_OK)



class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar pagos realizados en un financiamiento.
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        """
        Valida y registra un nuevo pago en un financiamiento.
        """
        financing = serializer.validated_data['financing']
        payment = serializer.save()

        # Verifica el saldo restante
        schedule = financing.calculate_payment_schedule()
        if not schedule or 'remaining_balance' not in schedule[-1]:
            raise serializers.ValidationError("No se pudo calcular el saldo restante.")

        remaining_balance = schedule[-1]['remaining_balance']
        if remaining_balance <= 0:
            financing.status = 'PAID_OFF'
            financing.save()

        return payment
