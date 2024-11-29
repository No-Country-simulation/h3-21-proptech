from django.db.models.signals import post_save
from django.dispatch import receiver
from financing.models import Financing, Payment
from .models import CreditScore

@receiver(post_save, sender=Financing)
def update_credit_score_on_financing(sender, instance, **kwargs):
    print(f"Se ha guardado un financiamiento para el usuario: {instance.user.username}")
    try:
        credit_score, _ = CreditScore.objects.get_or_create(user=instance.user)
        credit_score.calculate_score()
        credit_score.save()  # Asegúrate de guardar los cambios
        print(f"CreditScore actualizado para el usuario {instance.user.username}: {credit_score.score}")
    except Exception as e:
        print(f"Error al actualizar el CreditScore: {e}")

@receiver(post_save, sender=Payment)
def update_credit_score_on_payment(sender, instance, **kwargs):
    print(f"Se ha registrado un pago para el usuario: {instance.financing.user.username}")
    financing = instance.financing
    try:
        credit_score, created = CreditScore.objects.get_or_create(user=financing.user)
        credit_score.adjust_for_payment_behavior(financing)
        credit_score.save()  # Asegúrate de guardar los cambios
        print(f"CreditScore ajustado para el usuario {financing.user.username}: {credit_score.score}")
    except CreditScore.DoesNotExist:
        print(f"No se encontró un CreditScore para el usuario {financing.user}")
    except Exception as e:
        print(f"Error al actualizar el CreditScore: {e}")

