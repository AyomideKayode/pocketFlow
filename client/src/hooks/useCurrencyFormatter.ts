import { useCallback } from 'react';
import { useUserProfile } from '../contexts/user-profile-context';

export const useCurrencyFormatter = () => {
  const { currency } = useUserProfile();

  const format = useCallback(
    (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },
    [currency],
  );

  return format;
};
