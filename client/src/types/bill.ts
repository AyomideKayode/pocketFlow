export interface Bill {
  _id?: string; // Optional for creation
  userId: string;
  name: string;
  amount: number;
  dueDay: number;
  isRecurring: boolean;
  lastPaidPeriod: string | null;
  createdAt?: string;
  updatedAt?: string;
}
