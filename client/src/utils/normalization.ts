export const normalizePaymentMethod = (raw: string): string => {
  if (!raw) return 'CSV Import';

  const normalized = raw.trim().toLowerCase();

  // Return early if already normalized (or close enough)
  if (['credit card', 'cash', 'bank transfer'].includes(normalized)) {
    // Capitalize properly
    if (normalized === 'credit card') return 'Credit Card';
    if (normalized === 'cash') return 'Cash';
    if (normalized === 'bank transfer') return 'Bank Transfer';
  }

  // Credit Card
  // Check for standalone "cc" using word boundaries or exact token match
  const isCC = /\bcc\b/.test(normalized);

  if (
    normalized.includes('credit') ||
    normalized.includes('visa') ||
    normalized.includes('mastercard') ||
    normalized.includes('amex') ||
    normalized.includes('card') ||
    isCC ||
    normalized.includes('debit')
  ) {
    console.log(`[Normalization] Payment Method: "${raw}" -> "Credit Card"`);
    return 'Credit Card';
  }

  // Cash
  // Exclude electronic bill phrases from "bill" check
  const isBill = normalized.includes('bill');
  const isElectronicBill =
    normalized.includes('bill pay') ||
    normalized.includes('billpay') ||
    normalized.includes('bill payment') ||
    normalized.includes('utility');

  if (
    normalized.includes('cash') ||
    (isBill && !isElectronicBill) ||
    normalized.includes('notes')
    // removed 'coin' to avoid false positives with 'bitcoin'
  ) {
    console.log(`[Normalization] Payment Method: "${raw}" -> "Cash"`);
    return 'Cash';
  }

  // Bank Transfer
  if (
    normalized.includes('transfer') ||
    normalized.includes('bank') ||
    normalized.includes('wire') ||
    normalized.includes('ach') ||
    normalized.includes('deposit') ||
    normalized.includes('eft')
  ) {
    console.log(`[Normalization] Payment Method: "${raw}" -> "Bank Transfer"`);
    return 'Bank Transfer';
  }

  // Fallback
  console.log(
    `[Normalization] Payment Method: "${raw}" -> Fallback "CSV Import" (Confidence Low)`,
  );
  return 'CSV Import';
};
