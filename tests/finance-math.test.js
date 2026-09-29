import { describe, it, expect } from 'vitest';
import { FinanceMath } from '../src/finance/finance-math.js';

describe('FinanceMath Service', () => {
  const fin = new FinanceMath();

  it('calculates compound interest correctly', () => {
    // 1000€ at 5% for 10 years compounded monthly -> ~1647.01€
    const fv = fin.compoundInterest(1000, 5, 10, 12);
    expect(fv).toBeCloseTo(1647.01, 1);
  });

  it('calculates monthly fixed-rate loan amortization payments', () => {
    // 10,000€ loan at 5% annual rate for 5 years
    const payment = fin.monthlyLoanPayment(10000, 5, 5);
    expect(payment).toBeCloseTo(188.71, 1);
  });

  it('handles zero interest loan repayment', () => {
    const payment = fin.monthlyLoanPayment(1200, 0, 1);
    expect(payment).toBe(100);
  });

  it('calculates ROI percentage accurately', () => {
    const roi = fin.calculateROI(100, 150);
    expect(roi).toBe(50);
  });
});
