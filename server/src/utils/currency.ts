export const formatCurrency = (
  amount: number,
  currencyCode: string = 'USD',
): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency codes
    return `$${amount.toFixed(2)}`;
  }
};
