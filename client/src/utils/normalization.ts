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
  if (
    normalized.includes('credit') ||
    normalized.includes('visa') ||
    normalized.includes('mastercard') ||
    normalized.includes('amex') ||
    normalized.includes('card') ||
    normalized.includes('cc') ||
    normalized.includes('debit')
  ) {
    console.log(`[Normalization] Payment Method: "${raw}" -> "Credit Card"`);
    return 'Credit Card';
  }

  // Cash
  if (
    normalized.includes('cash') ||
    normalized.includes('bill') ||
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
