from django.db.models.signals import post_save
from django.dispatch import receiver
from financing.models import Financing, Payment
from .models import CreditScore

@receiver(post_save, sender=Financing)
def update_credit_score_on_financing(sender, instance, **kwargs):
    try:
        credit_score, _ = CreditScore.objects.get_or_create(user=instance.user)
        credit_score.calculate_score()
    except Exception as e:
        print(f"Error al actualizar el CreditScore: {e}")


@receiver(post_save, sender=Payment)
def update_credit_score_on_payment(sender, instance, **kwargs):
    """
    Ajusta el CreditScore automáticamente al registrar un pago.
    """
    financing = instance.financing
    credit_score = CreditScore.objects.get(user=financing.user)
    credit_score.adjust_for_payment_behavior(financing)
