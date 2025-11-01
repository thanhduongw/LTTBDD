export interface Expense {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
  type: 'income' | 'expense';
  isDeleted?: boolean;
}

// export interface MockAPIExpense {
//   id?: string;
//   title: string;
//   amount: number;
//   createdAt: string;
//   type: 'income' | 'expense';
//   isDeleted: boolean;
// }

// export type RootStackParamList = {
//   Home: undefined;
//   AddEditExpense: { expense?: Expense };
//   Trash: undefined;
//   Statistics: undefined;
//   ApiSettings: undefined;
// };

// export type FilterType = 'all' | 'income' | 'expense';