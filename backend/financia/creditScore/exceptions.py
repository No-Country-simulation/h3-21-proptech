class CreditScoreError(Exception):
    """Base exception for credit score errors"""
    pass

class InvalidIncomeError(CreditScoreError):
    """Raised when income is invalid"""
    pass

class InvalidDebtRatioError(CreditScoreError):
    """Raised when debt-to-income ratio is too high"""
    pass