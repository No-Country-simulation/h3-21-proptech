from django.db import models

class CreditSimulation(models.Model):
    """
    Modelo para registrar simulaciones de crédito realizadas en la plataforma.
    """
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Monto solicitado en la simulación.")
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Tasa de interés anual en porcentaje.")
    term_months = models.PositiveIntegerField(help_text="Plazo en meses.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Fecha y hora de creación de la simulación.")

    def __str__(self):
        return f"Simulación de {self.loan_amount} a {self.interest_rate}% por {self.term_months} meses"
