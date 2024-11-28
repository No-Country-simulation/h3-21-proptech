from decimal import Decimal, ROUND_HALF_UP

from typing import Dict, List, Union
from .exceptions import InvalidAmountError, InvalidInterestRateError

def calculate_credit_details(
    requested_amount: Union[Decimal, float], 
    monthly_interest_rate: Union[Decimal, float], 
    term_months: int
) -> Dict:
    """
    Calcula el detalle de pagos mensuales y saldo restante.
    
    Args:
        requested_amount: Monto solicitado del préstamo
        monthly_interest_rate: Tasa de interés mensual en porcentaje
        term_months: Plazo en meses
        
    Returns:
        Dict con los detalles del crédito incluyendo pagos mensuales y balance
        
    Raises:
        InvalidAmountError: Si el monto es negativo o cero
        InvalidInterestRateError: Si la tasa es negativa
    """
    try:
        monthly_interest_rate = Decimal(str(monthly_interest_rate)) / Decimal('100')
        requested_amount = Decimal(str(requested_amount))
        term_months = int(term_months)

        if requested_amount <= 0:
            raise InvalidAmountError("El monto debe ser mayor a cero")
            
        if monthly_interest_rate < 0:
            raise InvalidInterestRateError("La tasa de interés no puede ser negativa")

        # Cuota mensual (fórmula de Excel)
        monthly_payment = requested_amount * (
            monthly_interest_rate * (1 + monthly_interest_rate) ** term_months
        ) / ((1 + monthly_interest_rate) ** term_months - 1)

        balances = _calculate_payment_schedule(
            requested_amount,
            monthly_payment,
            monthly_interest_rate,
            term_months
        )

        return _prepare_credit_summary(
            monthly_payment,
            balances,
            term_months,
            monthly_interest_rate
        )
        
    except (ValueError, TypeError) as e:
        raise InvalidAmountError(f"Error en los datos de entrada: {str(e)}")

def _calculate_payment_schedule(
    requested_amount: Decimal,
    monthly_payment: Decimal,
    monthly_interest_rate: Decimal,
    term_months: int,
    early_payments: Dict[int, Decimal] = None,
    penalty_rate: Decimal = Decimal('0.002')  # Interés diario por mora
) -> List[Dict]:
    balances = []
    current_balance = requested_amount
    
    for month in range(1, term_months + 1):
        interest_payment = current_balance * monthly_interest_rate
        principal_payment = monthly_payment - interest_payment

        # Aplicar pagos adelantados
        if early_payments and month in early_payments:
            principal_payment += early_payments[month]
        
        # Aplicar intereses punitorios si hay atraso
        if month > 1 and balances[-1]['remaining_balance'] > 0:
            interest_payment += balances[-1]['remaining_balance'] * penalty_rate
        
        current_balance -= principal_payment

        balances.append({
            "month": month,
            "interest_payment": _round_decimal(interest_payment),
            "principal_payment": _round_decimal(principal_payment),
            "remaining_balance": _round_decimal(current_balance),
        })
    
    return balances


def _prepare_credit_summary(
    monthly_payment: Decimal,
    balances: List[Dict],
    term_months: int,
    monthly_interest_rate: Decimal
) -> Dict:
    """Prepara el resumen del crédito"""
    return {
        "monthly_payment": _round_decimal(monthly_payment),
        "total_interest": _round_decimal(sum(b["interest_payment"] for b in balances)),
        "total_payment": _round_decimal(monthly_payment * term_months),
        "annual_cost": _round_decimal(monthly_interest_rate * 12 * 100),
        "balances": balances,
    }

def _round_decimal(value: Decimal) -> Decimal:
    """Redondea un valor decimal a 2 decimales"""
    return Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def calculate_early_payment_discount(remaining_balance: Decimal, months_ahead: int) -> Decimal:
    discount_rate = Decimal('0.07') + (Decimal('0.03') * months_ahead)  # 7% base + 3% por cada mes
    return remaining_balance * discount_rate

