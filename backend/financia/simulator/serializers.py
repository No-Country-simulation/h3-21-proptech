from rest_framework import serializers
from .models import CreditSimulation

class CreditSimulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditSimulation
        fields = ['loan_amount', 'interest_rate', 'term_months']
    
    def validate_loan_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto del préstamo debe ser mayor a cero.")
        return value

    def validate_interest_rate(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("La tasa de interés debe estar entre 0 y 100%.")
        return value

    def validate_term_months(self, value):
        if value <= 0 or value > 360:
            raise serializers.ValidationError("El plazo debe ser mayor a 0 y no superar 360 meses (30 años).")
        return value
