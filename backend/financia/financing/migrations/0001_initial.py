# Generated by Django 5.1.3 on 2024-11-27 23:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Financing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('loan_amount', models.DecimalField(decimal_places=2, help_text='Monto total financiado.', max_digits=12)),
                ('annual_interest_rate', models.DecimalField(decimal_places=2, help_text='Tasa de interés anual en porcentaje.', max_digits=5)),
                ('term_months', models.PositiveIntegerField(help_text='Plazo del financiamiento en meses.')),
                ('start_date', models.DateField(help_text='Fecha de inicio del financiamiento.')),
                ('payment_due_day', models.PositiveIntegerField(default=10, help_text='Día del mes en que vence el pago.')),
                ('status', models.CharField(choices=[('ACTIVE', 'Activo'), ('PAID_OFF', 'Pagado'), ('DEFAULTED', 'En mora')], default='ACTIVE', help_text='Estado del financiamiento.', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Fecha de creación del financiamiento.')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Última actualización del financiamiento.')),
                ('user', models.ForeignKey(help_text='Usuario asociado al financiamiento.', on_delete=django.db.models.deletion.CASCADE, related_name='financings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, help_text='Monto del pago.', max_digits=10)),
                ('payment_date', models.DateField(help_text='Fecha del pago.')),
                ('is_early_payment', models.BooleanField(default=False, help_text='¿Este pago fue realizado de forma anticipada?')),
                ('is_late_payment', models.BooleanField(default=False, help_text='¿Este pago fue realizado fuera del plazo?')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('financing', models.ForeignKey(help_text='Financiamiento relacionado con este pago.', on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='financing.financing')),
            ],
            options={
                'ordering': ['-payment_date'],
            },
        ),
        migrations.AddIndex(
            model_name='financing',
            index=models.Index(fields=['-created_at'], name='financing_f_created_671784_idx'),
        ),
        migrations.AddIndex(
            model_name='financing',
            index=models.Index(fields=['user'], name='financing_f_user_id_95c24f_idx'),
        ),
    ]
