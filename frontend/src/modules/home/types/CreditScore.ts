export interface CreditScore {
    id?: number;
    income: number;
    credit_history: boolean;
    score?: number | null;
    risk_category?: {
      category: string;
      description: string;
      score: number;
    } | null;
  }