export type TransactionType = 'expense' | 'income';

export type AccountType = '現金' | '信用卡' | '銀行帳戶';

export interface CategoryItem {
  id: string;
  name: string;
  type: TransactionType;
  iconName: string;
  color: string;
  isPreset?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: string;
  account: AccountType;
  note?: string;
  createdAt: number;
}

export interface BudgetSettings {
  monthlyTotalBudget: number;
  categoryBudgets: Record<string, number>;
}
