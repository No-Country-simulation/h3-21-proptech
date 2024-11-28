from rest_framework import serializers
from decimal import Decimal
from .models import Financing, Payment


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer para registrar y consultar pagos realizados en un financiamiento."""

    class Meta:
        model = Payment
        fields = ['id', 'financing', 'amount', 'payment_date', 'is_early_payment', 'is_late_payment']
        read_only_fields = ['id', 'is_early_payment', 'is_late_payment']

    def validate(self, data):
        """
        Validación a nivel de objeto.
        - Validar que el monto del pago no sea mayor al saldo restante.
        """
        financing = data['financing']
        remaining_balance = financing.calculate_payment_schedule()[-1]['remaining_balance']

        if data['amount'] > remaining_balance:
            raise serializers.ValidationError("El monto del pago excede el saldo restante del financiamiento.")

        # Determinar si es un pago temprano o tardío
        payment_date = data['payment_date']
        due_day = financing.payment_due_day
        is_early = payment_date.day < due_day
        is_late = payment_date.day > due_day

        data['is_early_payment'] = is_early
        data['is_late_payment'] = is_late

        return data


class FinancingSerializer(serializers.ModelSerializer):
    """Serializer para gestionar financiamientos."""
    payments = PaymentSerializer(many=True, read_only=True)
    monthly_payment = serializers.SerializerMethodField()
    payment_schedule = serializers.SerializerMethodField()
    van_and_tir = serializers.SerializerMethodField()

    class Meta:
        model = Financing
        fields = [
            'id', 'user', 'loan_amount', 'annual_interest_rate', 'term_months',
            'start_date', 'payment_due_day', 'status', 'created_at', 'updated_at',
            'monthly_payment', 'payment_schedule', 'van_and_tir', 'payments'
        ]
        read_only_fields = ['id', 'user', 'monthly_payment', 'payment_schedule', 'van_and_tir', 'created_at', 'updated_at']

    def get_monthly_payment(self, obj):
        """Obtiene el monto mensual de la cuota."""
        return obj.calculate_monthly_payment()

    def get_payment_schedule(self, obj):
        """Genera el calendario de pagos."""
        return obj.calculate_payment_schedule()

    def get_van_and_tir(self, obj):
        """
        Calcula el VAN y la TIR para un financiamiento basado en flujos de efectivo.
        Ejemplo: Se usa una tasa de descuento del 10% anual.
        """
        cash_flows = [-obj.loan_amount] + [obj.calculate_monthly_payment()] * obj.term_months
        discount_rate = Decimal('0.10') / Decimal('12')  # 10% anual convertido a mensual
        return obj.calculate_van_and_tir(cash_flows, discount_rate)

