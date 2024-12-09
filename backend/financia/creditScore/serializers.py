from rest_framework import serializers
from decimal import Decimal
from .models import CreditScore
from .exceptions import CreditScoreError

class CreditScoreSerializer(serializers.ModelSerializer):
    risk_category = serializers.SerializerMethodField()

    class Meta:
        model = CreditScore
        fields = [
            'id', 'income', 'credit_history', 'score', 'risk_category'
        ]
        read_only_fields = ['score', 'user']

    def create(self, validated_data):
        user = self.context.get('request').user
        if not user.is_anonymous:
            validated_data['user'] = user
        # Si user es anónimo, no se asigna
        return super().create(validated_data)

    """def validate(self, data):
        Validación personalizada de los datos
        # Validar que el monto solicitado no sea mayor a 3 veces el ingreso
        if data['requested_amount'] > data['income'] * 3:
            raise serializers.ValidationError(
                "El monto solicitado no puede ser mayor a 3 veces el ingreso mensual"
            )

        # Validar tasa de interés razonable
        if data['monthly_interest_rate'] > Decimal('5'):
            raise serializers.ValidationError(
                "La tasa de interés mensual parece demasiado alta (máximo 5%)"
            )

        return data"""


    def get_risk_category(self, obj):
        """Obtiene la categoría de riesgo"""
        return obj.get_risk_category()

    """def get_monthly_payment(self, obj):
        Calcula el pago mensual
        try:
            return round(obj.calculate_monthly_payment(), 2)
        except Exception as e:
            return f"Error calculando el pago mensual: {str(e)}"""
