/**
 * Scientific Math Engine
 * High-precision trigonometric, logarithmic, and exponential utilities.
 */

export class ScientificEngine {
  constructor(angleMode = 'DEG') {
    this.angleMode = angleMode; // 'DEG' or 'RAD'
  }

  setAngleMode(mode) {
    if (mode === 'DEG' || mode === 'RAD') {
      this.angleMode = mode;
    }
  }

  toRadians(angle) {
    return this.angleMode === 'DEG' ? (angle * Math.PI) / 180 : angle;
  }

  toDegrees(angle) {
    return (angle * 180) / Math.PI;
  }

  sin(x) {
    const rad = this.toRadians(x);
    const res = Math.sin(rad);
    return Math.abs(res) < 1e-15 ? 0 : Number(res.toFixed(10));
  }

  cos(x) {
    const rad = this.toRadians(x);
    const res = Math.cos(rad);
    return Math.abs(res) < 1e-15 ? 0 : Number(res.toFixed(10));
  }

  tan(x) {
    const rad = this.toRadians(x);
    if (Math.abs(Math.cos(rad)) < 1e-15) {
      throw new Error('Tangent undefined (asymptote)');
    }
    const res = Math.tan(rad);
    return Math.abs(res) < 1e-15 ? 0 : Number(res.toFixed(10));
  }

  ln(x) {
    if (x <= 0) throw new Error('Logarithm undefined for non-positive values');
    return Number(Math.log(x).toFixed(10));
  }

  log10(x) {
    if (x <= 0) throw new Error('Logarithm undefined for non-positive values');
    return Number(Math.log10(x).toFixed(10));
  }

  log2(x) {
    if (x <= 0) throw new Error('Logarithm undefined for non-positive values');
    return Number(Math.log2(x).toFixed(10));
  }

  power(base, exponent) {
    return Math.pow(base, exponent);
  }

  cbrt(x) {
    return Math.cbrt(x);
  }

  nthRoot(base, n) {
    if (n === 0) throw new Error('0th root is undefined');
    if (base < 0 && n % 2 === 0) throw new Error('Even root of negative number is complex');
    return base < 0 ? -Math.pow(-base, 1 / n) : Math.pow(base, 1 / n);
  }

  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial only defined for non-negative integers');
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  get PI() {
    return Math.PI;
  }

  get E() {
    return Math.E;
  }

  get PHI() {
    return (1 + Math.sqrt(5)) / 2; // Golden ratio
  }
}
