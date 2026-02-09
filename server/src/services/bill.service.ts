import BillModel, { type Bill } from '../schema/bill.js';

export const getBills = async (userId: string, period?: string) => {
  const currentPeriod = period || new Date().toISOString().slice(0, 7);

  // We want:
  // 1. All recurring bills (regardless of lastPaidPeriod)
  // 2. One-time bills that are UNPAID (lastPaidPeriod is null)
  // 3. One-time bills that are PAID IN THIS PERIOD (lastPaidPeriod === currentPeriod)
  // Exclude one-time bills paid in previous periods.

  const query = {
    userId,
    $or: [
      { isRecurring: true },
      { lastPaidPeriod: null },
      { lastPaidPeriod: currentPeriod },
    ],
  };

  const bills = await BillModel.find(query).sort({ dueDay: 1 });
  return bills;
};

export const createBill = async (data: Partial<Bill>) => {
  const bill = new BillModel(data);
  return await bill.save();
};

export const updateBill = async (
  id: string,
  userId: string,
  data: Partial<Bill>,
) => {
  // Prevent userId or protected fields from being overwritten
  const { userId: _, _id, createdAt, updatedAt, ...safeData } = data as any;

  return await BillModel.findOneAndUpdate({ _id: id, userId }, safeData, {
    new: true,
  });
};

export const deleteBill = async (id: string, userId: string) => {
  return await BillModel.findOneAndDelete({ _id: id, userId });
};
