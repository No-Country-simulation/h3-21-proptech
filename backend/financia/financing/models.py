from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal, ROUND_HALF_UP


User = get_user_model()

class Financing(models.Model):
    """
    Modelo para gestionar financiamientos, incluyendo pagos mensuales, intereses,
    adelantos y penalizaciones.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='financings',
        help_text="Usuario asociado al financiamiento."
    )
    loan_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Monto total financiado."
    )
    annual_interest_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Tasa de interés anual en porcentaje."
    )
    term_months = models.PositiveIntegerField(
        help_text="Plazo del financiamiento en meses."
    )
    start_date = models.DateField(
        help_text="Fecha de inicio del financiamiento."
    )
    payment_due_day = models.PositiveIntegerField(
        default=10,
        help_text="Día del mes en que vence el pago."
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVE', 'Activo'),
            ('PAID_OFF', 'Pagado'),
            ('DEFAULTED', 'En mora'),
        ],
        default='ACTIVE',
        help_text="Estado del financiamiento."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha de creación del financiamiento."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Última actualización del financiamiento."
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user']),
        ]

    def calculate_monthly_payment(self) -> Decimal:
        """
        Calcula el monto de la cuota mensual según la fórmula de Excel.
        """
        monthly_interest_rate = self.annual_interest_rate / Decimal('12') / Decimal('100')
        numerator = monthly_interest_rate * (1 + monthly_interest_rate) ** self.term_months
        denominator = (1 + monthly_interest_rate) ** self.term_months - 1
        return _round_decimal(self.loan_amount * (numerator / denominator))

    def calculate_payment_schedule(self) -> list:
        """
        Genera el calendario completo de pagos, incluyendo principal, interés
        y saldo restante para cada mes.
        """
        monthly_payment = self.calculate_monthly_payment()
        monthly_interest_rate = self.annual_interest_rate / Decimal('12') / Decimal('100')
        balance = self.loan_amount
        schedule = []

        for month in range(1, self.term_months + 1):
            interest_payment = _round_decimal(balance * monthly_interest_rate)
            principal_payment = _round_decimal(monthly_payment - interest_payment)
            balance = _round_decimal(balance - principal_payment)

            schedule.append({
                "month": month,
                "monthly_payment": monthly_payment,
                "interest_payment": interest_payment,
                "principal_payment": principal_payment,
                "remaining_balance": balance
            })

        return schedule

    def calculate_early_payment_discount(self, remaining_balance: Decimal, months_ahead: int) -> Decimal:
        """
        Calcula el descuento aplicado por adelantamiento de cuotas.
        """
        base_discount_rate = Decimal('0.07')  # 7% base
        additional_rate = Decimal('0.03') * months_ahead  # 3% por cada mes adelantado
        discount_rate = base_discount_rate + additional_rate
        return _round_decimal(remaining_balance * discount_rate)

    def calculate_van_and_tir(self, cash_flows: list, discount_rate: Decimal) -> dict:
        """
        Calcula el VAN (Valor Actual Neto) y la TIR (Tasa Interna de Retorno).
        """
        # VAN
        van = sum(cf / ((1 + discount_rate) ** t) for t, cf in enumerate(cash_flows))

        # TIR (iterativo)
        tir = Decimal('0.0')
        for _ in range(100):  # Máximo de 100 iteraciones para converger
            tir += Decimal('0.001')
            npv = sum(cf / ((1 + tir) ** t) for t, cf in enumerate(cash_flows))
            if npv <= 0:
                break

        return {"van": _round_decimal(van), "tir": _round_decimal(tir * 100)}

    def __str__(self):
        return f"Financing #{self.id} ({self.user.username}) - {self.status}"


class Payment(models.Model):
    """
    Modelo para registrar los pagos realizados en un financiamiento.
    """
    financing = models.ForeignKey(
        Financing,
        on_delete=models.CASCADE,
        related_name='payments',
        help_text="Financiamiento relacionado con este pago."
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto del pago."
    )
    payment_date = models.DateField(
        help_text="Fecha del pago."
    )
    is_early_payment = models.BooleanField(
        default=False,
        help_text="¿Este pago fue realizado de forma anticipada?"
    )
    is_late_payment = models.BooleanField(
        default=False,
        help_text="¿Este pago fue realizado fuera del plazo?"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-payment_date']

    def __str__(self):
        return f"Pago de ${self.amount} en {self.payment_date}"


def _round_decimal(value: Decimal) -> Decimal:
    """Redondea un valor decimal a 2 decimales."""
    return value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

