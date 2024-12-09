export interface CreditSimulationInput {
    loan_amount: number;
    interest_rate: number;
    term_months: number;
  }
  
  export interface CreditBalance {
    month: number;
    interest_payment: number;
    principal_payment: number;
    remaining_balance: number;
  }
  
  export interface CreditSimulationResult {
    monthly_payment: number;
    total_interest: number;
    total_payment: number;
    annual_cost: number;
    balances: CreditBalance[];
  }