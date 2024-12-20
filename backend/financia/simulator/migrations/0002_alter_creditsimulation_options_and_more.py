# Generated by Django 5.1.3 on 2024-11-22 23:11

import django.core.validators
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('simulator', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='creditsimulation',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterField(
            model_name='creditsimulation',
            name='interest_rate',
            field=models.DecimalField(decimal_places=2, help_text='Tasa de interés anual en porcentaje.', max_digits=5, validators=[django.core.validators.MinValueValidator(Decimal('0.01')), django.core.validators.MaxValueValidator(Decimal('100'))]),
        ),
        migrations.AlterField(
            model_name='creditsimulation',
            name='loan_amount',
            field=models.DecimalField(decimal_places=2, help_text='Monto solicitado en la simulación.', max_digits=12, validators=[django.core.validators.MinValueValidator(Decimal('0.01'))]),
        ),
        migrations.AlterField(
            model_name='creditsimulation',
            name='term_months',
            field=models.PositiveIntegerField(help_text='Plazo en meses.', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(360)]),
        ),
        migrations.AddIndex(
            model_name='creditsimulation',
            index=models.Index(fields=['-created_at'], name='simulator_c_created_ee9155_idx'),
        ),
    ]
