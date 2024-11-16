from decimal import Decimal

def calculate_credit_simulation(loan_amount, annual_interest_rate, term_months):
    """
    Calcula el pago mensual, interés total y costo total de un crédito.
    """
    loan_amount = Decimal(loan_amount)
    annual_interest_rate = Decimal(annual_interest_rate) / 100
    term_months = Decimal(term_months)

    # Calcular la tasa de interés mensual
    monthly_rate = annual_interest_rate / 12

    # Fórmula de pago mensual
    if monthly_rate == 0:  # Caso sin interés
        monthly_payment = loan_amount / term_months
    else:
        monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** term_months) / ((1 + monthly_rate) ** term_months - 1)

    # Cálculos adicionales
    total_payment = monthly_payment * term_months
    total_interest = total_payment - loan_amount

    return {
        "monthly_payment": round(monthly_payment, 2),
        "total_payment": round(total_payment, 2),
        "total_interest": round(total_interest, 2),
    }
