from django.db import models
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from financing.models import Financing
from .constants import (
    BASE_SCORE, MIN_SCORE, MAX_SCORE, HIGH_INCOME_THRESHOLD,
    LOW_INCOME_THRESHOLD, HIGH_INCOME_BONUS, LOW_INCOME_PENALTY,
    POSITIVE_HISTORY_BONUS, NO_HISTORY_PENALTY, HIGH_DEBT_RATIO_PENALTY,
    MAX_DEBT_TO_INCOME_RATIO, RISK_CATEGORIES
)
from .exceptions import InvalidIncomeError, InvalidDebtRatioError


User = get_user_model()


class CreditScore(models.Model):
    """
    Modelo para calcular y almacenar puntajes crediticios de usuarios.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='credit_score',
        help_text="Usuario asociado al puntaje crediticio."
    )
    
    income = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Ingreso mensual del usuario."
    )
    
    requested_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Monto solicitado."
    )
    
    monthly_interest_rate = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        validators=[
            MinValueValidator(Decimal('0.0001')),
            MaxValueValidator(Decimal('100'))
        ],
        help_text="Tasa de interés mensual (%)."
    )
    
    term_months = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(360)],
        help_text="Plazo del financiamiento (meses)."
    )
    
    credit_history = models.BooleanField(
        default=False,
        help_text="¿Tiene historial crediticio positivo?"
    )
    
    score = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(MIN_SCORE),
            MaxValueValidator(MAX_SCORE)
        ],
        help_text="Puntaje calculado automáticamente."
    )

    active_financings = models.ManyToManyField(
        'financing.Financing',
        related_name='credit_scores',
        blank=True,
        help_text="Financiamientos activos del usuario"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha de creación del registro"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Última actualización del registro"
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['score']),
        ]

    def calculate_score(self) -> int:
        """
        Calcula el puntaje crediticio basado en varios factores.
        """
        if self.income <= 0:
            raise InvalidIncomeError("El ingreso debe ser mayor a cero")

        score = self._calculate_base_score()
        score = self._adjust_for_income(score)
        score = self._adjust_for_debt_ratio(score)
        score = self._adjust_for_credit_history(score)

        # Ajustar por financiamientos activos
        for financing in self.active_financings.all():
            self.adjust_for_payment_behavior(financing)

        self.score = self._normalize_score(score)
        self.save()
        return self.score

    def _calculate_base_score(self) -> int:
        """Calcula el puntaje base"""
        return BASE_SCORE

    def _adjust_for_income(self, score: int) -> int:
        """Ajusta el puntaje según el nivel de ingresos"""
        if self.income >= HIGH_INCOME_THRESHOLD:
            return score + HIGH_INCOME_BONUS
        elif self.income < LOW_INCOME_THRESHOLD:
            return score + LOW_INCOME_PENALTY
        return score

    def _adjust_for_debt_ratio(self, score: int) -> int:
        """Ajusta el puntaje según la relación deuda/ingreso"""
        debt_to_income_ratio = self.requested_amount / self.income
        if debt_to_income_ratio > MAX_DEBT_TO_INCOME_RATIO:
            raise InvalidDebtRatioError(
                f"La relación deuda/ingreso ({debt_to_income_ratio}) es demasiado alta"
            )
        return score + HIGH_DEBT_RATIO_PENALTY if debt_to_income_ratio > 1 else score

    def _adjust_for_credit_history(self, score: int) -> int:
        """Ajusta el puntaje según el historial crediticio"""
        return score + (POSITIVE_HISTORY_BONUS if self.credit_history else NO_HISTORY_PENALTY)

    def _normalize_score(self, score: int) -> int:
        """Normaliza el puntaje dentro del rango permitido"""
        return max(MIN_SCORE, min(score, MAX_SCORE))

    def get_risk_category(self) -> dict:
        """
        Determina la categoría de riesgo basada en el puntaje.
        
        Returns:
            dict: Categoría de riesgo con su descripción
        """
        for category, limits in RISK_CATEGORIES.items():
            if limits['min'] <= self.score <= limits['max']:
                return {
                    'category': category,
                    'description': limits['description'],
                    'score': self.score
                }
        return None

    def calculate_monthly_payment(self) -> Decimal:
        """
        Calcula el pago mensual basado en el monto solicitado y la tasa.
        
        Returns:
            Decimal: Monto del pago mensual
        """
        rate = self.monthly_interest_rate / Decimal('100')
        numerator = rate * (1 + rate) ** self.term_months
        denominator = (1 + rate) ** self.term_months - 1
        return self.requested_amount * (numerator / denominator)

    def __str__(self):
        return f"CreditScore de {self.user.username}: {self.score}"
    
    def adjust_for_payment_behavior(self, financing):
        """
        Ajusta el puntaje según los pagos asociados al financiamiento (adelantados o tardíos).
        """
        payments = financing.payments.all()
        for payment in payments:
            if payment.is_early_payment:
                self.score += 10  # Bonificación por pago adelantado
            elif payment.is_late_payment:
                self.score -= 20  # Penalización por pago tardío
        self.save()

    def get_late_financings(self):
        """
        Retorna los financiamientos del usuario con pagos atrasados.
        """
        return self.active_financings.filter(payments__is_late_payment=True)

    def generate_summary(self):
        """
        Retorna un resumen del CreditScore.
        """
        return {
            "score": self.score,
            "risk_category": self.get_risk_category(),
            "income": self.income,
            "active_financings_count": self.active_financings.count(),
        }

    def get_risk_category(self) -> dict:
        """
        Determina la categoría de riesgo basada en el puntaje.
        """
        for category, limits in RISK_CATEGORIES.items():
            if limits['min'] <= self.score <= limits['max']:
                return {
                    'category': category,
                    'description': limits['description'],
                    'score': self.score
                }
        return None