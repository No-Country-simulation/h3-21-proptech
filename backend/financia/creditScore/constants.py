from decimal import Decimal

# Puntajes base
BASE_SCORE = 500
MIN_SCORE = 300
MAX_SCORE = 850

# Umbrales de ingresos
HIGH_INCOME_THRESHOLD = Decimal('100000')
LOW_INCOME_THRESHOLD = Decimal('30000')

# Modificadores de puntaje
HIGH_INCOME_BONUS = 100
LOW_INCOME_PENALTY = -100
POSITIVE_HISTORY_BONUS = 150
NO_HISTORY_PENALTY = -50
HIGH_DEBT_RATIO_PENALTY = -100

# Umbrales de ratio deuda/ingreso
MAX_DEBT_TO_INCOME_RATIO = Decimal('2.0')

# Categorías de riesgo
RISK_CATEGORIES = {
    'VERY_LOW': {'min': 750, 'max': 850, 'description': 'Riesgo muy bajo'},
    'LOW': {'min': 650, 'max': 749, 'description': 'Riesgo bajo'},
    'MEDIUM': {'min': 550, 'max': 649, 'description': 'Riesgo medio'},
    'HIGH': {'min': 400, 'max': 549, 'description': 'Riesgo alto'},
    'VERY_HIGH': {'min': 300, 'max': 399, 'description': 'Riesgo muy alto'}
}