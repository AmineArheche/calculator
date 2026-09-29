/**
 * Financial Mathematics Engine
 * Compound interest, loan amortization payments, and investment growth calculations.
 */

export class FinanceMath {
  /**
   * Calculate future value with compound interest
   * A = P(1 + r/n)^(nt)
   * @param {number} principal - Initial amount
   * @param {number} annualRate - Annual rate in % (e.g. 5 for 5%)
   * @param {number} years - Time in years
   * @param {number} compoundingFrequency - Times compounded per year (default 12 = monthly)
   */
  compoundInterest(principal, annualRate, years, compoundingFrequency = 12) {
    if (principal < 0 || annualRate < 0 || years < 0) throw new Error('Parameters must be non-negative');
    const r = annualRate / 100;
    const n = compoundingFrequency;
    const t = years;
    const amount = principal * Math.pow(1 + r / n, n * t);
    return Number(amount.toFixed(2));
  }

  /**
   * Calculate monthly payment for a fixed-rate loan
   * M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
   * @param {number} principal - Total loan amount
   * @param {number} annualRate - Annual interest rate in %
   * @param {number} years - Loan term in years
   */
  monthlyLoanPayment(principal, annualRate, years) {
    if (principal <= 0 || years <= 0) throw new Error('Principal and years must be positive');
    const monthlyRate = annualRate / 100 / 12;
    const totalPayments = years * 12;

    if (monthlyRate === 0) {
      return Number((principal / totalPayments).toFixed(2));
    }

    const payment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    return Number(payment.toFixed(2));
  }

  /**
   * Calculate return on investment (ROI) percentage
   */
  calculateROI(initialCost, finalValue) {
    if (initialCost === 0) throw new Error('Initial cost cannot be zero');
    const roi = ((finalValue - initialCost) / initialCost) * 100;
    return Number(roi.toFixed(2));
  }
}
