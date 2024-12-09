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
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class CreditScore(models.Model):
    """
    Modelo para calcular y almacenar puntajes crediticios de usuarios.

    Este modelo contiene toda la lógica necesaria para calcular el puntaje
    crediticio de un usuario basándose en factores como ingresos, relación
    deuda/ingreso, historial crediticio, y comportamiento de financiamientos activos.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='credit_score',
        null=True,  # Permite que el campo user sea nulo
        blank=True,
        help_text="Usuario asociado al puntaje crediticio."
    )
    
    income = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Ingreso mensual del usuario."
    )
    
    credit_history = models.BooleanField(
        default=False,
        help_text="Indica si el usuario tiene un historial crediticio positivo."
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
        Financing,
        related_name='credit_scores',
        blank=True,
        help_text="Lista de financiamientos activos asociados al usuario."
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha de creación del registro."
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Última actualización del registro."
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
        Calcula y almacena el puntaje crediticio del usuario.

        El cálculo se basa en los ingresos, la relación deuda/ingreso,
        el historial crediticio y otros factores.
        
        Returns:
            int: Puntaje crediticio calculado.
        """
        if self.income <= 0:
            raise InvalidIncomeError("El ingreso debe ser mayor a cero.")

        score = self._calculate_base_score()
        logger.info(f"Puntaje base: {score}")

        score = self._adjust_for_income(score)
        logger.info(f"Puntaje después de ajuste por ingresos: {score}")

        score = self._adjust_for_debt_to_income_ratio(score)
        logger.info(f"Puntaje después de ajuste por relación deuda/ingreso: {score}")

        score = self._adjust_for_credit_history(score)
        logger.info(f"Puntaje después de ajuste por historial crediticio: {score}")

        score = self._adjust_for_active_financings(score)
        logger.info(f"Puntaje después de ajuste por financiamientos activos: {score}")

        # Normalización del puntaje final
        self.score = self._normalize_score(score)
        logger.info(f"Puntaje normalizado: {self.score}")
        self.save()
        return self.score

    def _calculate_base_score(self) -> int:
        """Calcula el puntaje base predeterminado."""
        return BASE_SCORE

    def _adjust_for_income(self, score: int) -> int:
        """
        Ajusta el puntaje basado en el nivel de ingresos.

        Args:
            score (int): Puntaje actual.

        Returns:
            int: Puntaje ajustado según ingresos.
        """
        if self.income >= HIGH_INCOME_THRESHOLD:
            return score + HIGH_INCOME_BONUS
        elif self.income < LOW_INCOME_THRESHOLD:
            return score + LOW_INCOME_PENALTY
        return score

    def _adjust_for_debt_to_income_ratio(self, score: int) -> int:
        """
        Ajusta el puntaje basado en la relación deuda/ingreso.

        Args:
            score (int): Puntaje actual.

        Returns:
            int: Puntaje ajustado según la relación deuda/ingreso.
        """
        total_debt = sum(financing.amount for financing in self.active_financings.all())
        if total_debt == 0:
            return score
        debt_to_income_ratio = total_debt / self.income
        if debt_to_income_ratio > MAX_DEBT_TO_INCOME_RATIO:
            raise InvalidDebtRatioError(
                f"La relación deuda/ingreso ({debt_to_income_ratio:.2f}) es demasiado alta."
            )
        return score + HIGH_DEBT_RATIO_PENALTY if debt_to_income_ratio > 1 else score

    def _adjust_for_credit_history(self, score: int) -> int:
        """
        Ajusta el puntaje basado en el historial crediticio.

        Args:
            score (int): Puntaje actual.

        Returns:
            int: Puntaje ajustado según historial crediticio.
        """
        return score + (POSITIVE_HISTORY_BONUS if self.credit_history else NO_HISTORY_PENALTY)

    def _adjust_for_active_financings(self, score: int) -> int:
        """
        Ajusta el puntaje basado en los financiamientos activos.

        Args:
            score (int): Puntaje actual.

        Returns:
            int: Puntaje ajustado según financiamientos activos.
        """
        for financing in self.active_financings.all():
            score += self._adjust_for_financing_payments(financing)
        return score

    def _adjust_for_financing_payments(self, financing: Financing) -> int:
        """
        Ajusta el puntaje según los comportamientos de pago en un financiamiento.

        Args:
            financing (Financing): Instancia de un financiamiento activo.

        Returns:
            int: Ajuste acumulado basado en pagos.
        """
        adjustment = 0
        for payment in financing.payments.all():
            if payment.is_early_payment:
                adjustment += 10  # Bonificación por pago adelantado
            elif payment.is_late_payment:
                adjustment -= 20  # Penalización por pago tardío
        return adjustment

    def _normalize_score(self, score: int) -> int:
        """
        Normaliza el puntaje dentro del rango permitido.

        Args:
            score (int): Puntaje actual.

        Returns:
            int: Puntaje normalizado.
        """
        return max(MIN_SCORE, min(score, MAX_SCORE))

    def get_risk_category(self) -> dict:
        """
        Determina la categoría de riesgo basada en el puntaje.

        Returns:
            dict: Categoría de riesgo con descripción y puntaje.
        """
        for category, limits in RISK_CATEGORIES.items():
            if limits['min'] <= self.score <= limits['max']:
                return {
                    'category': category,
                    'description': limits['description'],
                    'score': self.score
                }
        return None

    def adjust_for_payment_behavior(self, financing: Financing) -> None:
        """
        Ajusta el puntaje basado en el comportamiento de pago en un financiamiento.

        Args:
            financing (Financing): Instancia de un financiamiento activo.
        """
        adjustment = self._adjust_for_financing_payments(financing)
        self.score += adjustment
        self.save()