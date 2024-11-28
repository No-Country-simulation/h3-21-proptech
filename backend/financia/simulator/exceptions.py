class CreditSimulationError(Exception):
    """Base exception for credit simulation errors"""
    pass

class InvalidAmountError(CreditSimulationError):
    """Raised when the loan amount is invalid"""
    pass

class InvalidInterestRateError(CreditSimulationError):
    """Raised when the interest rate is invalid"""
    pass