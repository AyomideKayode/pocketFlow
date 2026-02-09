import { describe, it, expect } from 'vitest';
import { normalizePaymentMethod } from './normalization';

describe('normalizePaymentMethod', () => {
  it('should normalize known aliases for Credit Card', () => {
    expect(normalizePaymentMethod('visa')).toBe('Credit Card');
    expect(normalizePaymentMethod('MasterCard')).toBe('Credit Card');
    expect(normalizePaymentMethod('Credit Card')).toBe('Credit Card');
    expect(normalizePaymentMethod('Amex ending 1234')).toBe('Credit Card');
    expect(normalizePaymentMethod('CC Payment')).toBe('Credit Card');
  });

  it('should normalize known aliases for Cash', () => {
    expect(normalizePaymentMethod('cash')).toBe('Cash');
    expect(normalizePaymentMethod('Petty Cash')).toBe('Cash');
    expect(normalizePaymentMethod('notes')).toBe('Cash');
  });

  it('should normalize known aliases for Bank Transfer', () => {
    expect(normalizePaymentMethod('Bank Transfer')).toBe('Bank Transfer');
    expect(normalizePaymentMethod('wire')).toBe('Bank Transfer');
    expect(normalizePaymentMethod('Direct Deposit')).toBe('Bank Transfer');
    expect(normalizePaymentMethod('ACH Transfer')).toBe('Bank Transfer');
  });

  it('should fallback to CSV Import for unknown values', () => {
    expect(normalizePaymentMethod('Bitcoin')).toBe('CSV Import');
    expect(normalizePaymentMethod('Barter')).toBe('CSV Import');
    expect(normalizePaymentMethod('')).toBe('CSV Import');
    // @ts-ignore
    expect(normalizePaymentMethod(null)).toBe('CSV Import');
  });

  it('should prioritize stricter matches if overlapping?', () => {
    // "Credit Note" -> Credit Card?
    expect(normalizePaymentMethod('Credit Note')).toBe('Credit Card');
  });
});
