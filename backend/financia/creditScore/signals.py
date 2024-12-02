import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from financing.models import Financing, Payment
from .models import CreditScore

# Configuración de logging
logger = logging.getLogger(__name__)

def update_credit_score(user, adjustment_function, *args, **kwargs):
    """
    Actualiza el puntaje crediticio de un usuario aplicando una función de ajuste.

    Args:
        user (User): Usuario cuyo puntaje crediticio será actualizado.
        adjustment_function (Callable): Función que ajusta el puntaje crediticio.
    """
    try:
        with transaction.atomic():  # Garantiza que los cambios se hagan de forma atómica.
            credit_score, _ = CreditScore.objects.get_or_create(user=user)
            adjustment_function(credit_score, *args, **kwargs)
            credit_score.save()
            logger.info(f"CreditScore actualizado para el usuario {user.username}: {credit_score.score}")
    except Exception as e:
        logger.error(f"Error al actualizar el CreditScore para el usuario {user.username}: {e}")

@receiver(post_save, sender=Financing)
def update_credit_score_on_financing(sender, instance, **kwargs):
    """
    Señal para actualizar el CreditScore cuando se guarda un financiamiento.
    """
    logger.info(f"Se ha guardado un financiamiento para el usuario: {instance.user.username}")
    update_credit_score(instance.user, lambda cs: cs.calculate_score())

@receiver(post_save, sender=Payment)
def update_credit_score_on_payment(sender, instance, **kwargs):
    """
    Señal para actualizar el CreditScore cuando se registra un pago.
    """
    financing = instance.financing
    logger.info(f"Se ha registrado un pago para el usuario: {financing.user.username}")
    update_credit_score(financing.user, lambda cs: cs.adjust_for_payment_behavior(financing))

