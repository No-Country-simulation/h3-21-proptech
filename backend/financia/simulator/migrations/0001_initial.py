# Generated by Django 5.1.3 on 2024-11-15 00:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CreditSimulation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('loan_amount', models.DecimalField(decimal_places=2, help_text='Monto solicitado en la simulación.', max_digits=12)),
                ('interest_rate', models.DecimalField(decimal_places=2, help_text='Tasa de interés anual en porcentaje.', max_digits=5)),
                ('term_months', models.PositiveIntegerField(help_text='Plazo en meses.')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Fecha y hora de creación de la simulación.')),
            ],
        ),
    ]