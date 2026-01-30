import { useCallback, useMemo } from 'react';
import { useUserProfile } from '../contexts/user-profile-context';

export const useCurrencyFormatter = () => {
  const { currency } = useUserProfile();

  const format = useCallback(
    (amount: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options,
      }).format(amount);
    },
    [currency],
  );

  const currencySymbol = useMemo(() => {
    try {
      return (
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          currencyDisplay: 'narrowSymbol',
        })
          .formatToParts(0)
          .find((p) => p.type === 'currency')?.value || '$'
      );
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to derive currency symbol for', currency, e);
      }
        return '$';
    }
  }, [currency]);

  return { format, currencySymbol };
};
