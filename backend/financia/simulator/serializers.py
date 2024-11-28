from rest_framework import serializers
from .models import CreditSimulation
from decimal import Decimal
from typing import Dict, Any

class CreditSimulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditSimulation
        fields = ['loan_amount', 'interest_rate', 'term_months']
        extra_kwargs = {
            'loan_amount': {'required': True},
            'interest_rate': {'required': True},
            'term_months': {'required': True}
        }

    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validación a nivel de objeto"""
        # Validamos que el monto del préstamo sea razonable
        if data['loan_amount'] > Decimal('10000000'):
            raise serializers.ValidationError(
                "El monto del préstamo no puede superar los 10 millones."
            )

        # Validamos que la tasa de interés sea razonable
        if data['interest_rate'] > Decimal('50'):
            raise serializers.ValidationError(
                "La tasa de interés parece demasiado alta. Máximo permitido: 50%"
            )

        return data