export interface Expense {
  id?: number;
  title: string;
  amount: number;
  createdAt: string;
  type: 'income' | 'expense';
  isDeleted?: boolean;
}