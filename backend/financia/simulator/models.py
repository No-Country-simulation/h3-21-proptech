from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

class CreditSimulation(models.Model):
    """
    Modelo para registrar simulaciones de crédito realizadas en la plataforma.
    """
    loan_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Monto solicitado en la simulación."
    )
    interest_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal('0.01')),
            MaxValueValidator(Decimal('100'))
        ],
        help_text="Tasa de interés anual en porcentaje."
    )
    term_months = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(360)],
        help_text="Plazo en meses."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora de creación de la simulación."
    )
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"Simulación de {self.loan_amount} a {self.interest_rate}% por {self.term_months} meses"

    def calculate_monthly_payment(self):
        """Calcula el pago mensual de la simulación"""
        from .utils import calculate_credit_details
        result = calculate_credit_details(
            self.loan_amount,
            self.interest_rate / 12,  # Convertir tasa anual a mensual
            self.term_months
        )
        return result['monthly_payment']
