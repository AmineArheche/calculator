/**
 * Precision Math Engine for Professional Web Calculator
 * Solves IEEE 754 floating-point arithmetic inaccuracies and handles edge cases.
 */

export const ERROR_MESSAGES = {
  DIVISION_BY_ZERO: 'Cannot divide by zero',
  INVALID_INPUT: 'Invalid calculation',
};

/**
 * Returns the number of decimal places of a number or string representation.
 * @param {number|string} n 
 * @returns {number}
 */
export function getDecimalPlaces(n) {
  const str = n.toString();
  if (str.includes('e-')) {
    const parts = str.split('e-');
    return parseInt(parts[1], 10);
  }
  const decimalPart = str.split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

/**
 * Normalizes floating point numbers to avoid representation artifacts like 0.30000000000000004.
 * Uses high-precision scaling and epsilon rounding.
 * @param {number} num 
 * @param {number} [maxDecimals=12]
 * @returns {number}
 */
export function normalizePrecision(num, maxDecimals = 12) {
  if (typeof num !== 'number' || !Number.isFinite(num)) {
    return num;
  }
  return parseFloat(Number(Math.round(num + `e+${maxDecimals}`) + `e-${maxDecimals}`).toFixed(maxDecimals));
}

/**
 * Exact addition avoiding float inaccuracies (e.g. 0.1 + 0.2 === 0.3).
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function add(a, b) {
  const factor = Math.pow(10, Math.max(getDecimalPlaces(a), getDecimalPlaces(b)));
  const result = (Math.round(a * factor) + Math.round(b * factor)) / factor;
  return normalizePrecision(result);
}

/**
 * Exact subtraction avoiding float inaccuracies.
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function subtract(a, b) {
  const factor = Math.pow(10, Math.max(getDecimalPlaces(a), getDecimalPlaces(b)));
  const result = (Math.round(a * factor) - Math.round(b * factor)) / factor;
  return normalizePrecision(result);
}

/**
 * Exact multiplication avoiding float inaccuracies (e.g. 0.2 * 0.1 === 0.02).
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function multiply(a, b) {
  const factorA = Math.pow(10, getDecimalPlaces(a));
  const factorB = Math.pow(10, getDecimalPlaces(b));
  const intA = Math.round(a * factorA);
  const intB = Math.round(b * factorB);
  const result = (intA * intB) / (factorA * factorB);
  return normalizePrecision(result);
}

/**
 * Exact division with division by zero guard.
 * @param {number} a 
 * @param {number} b 
 * @throws {Error} If dividing by zero
 * @returns {number}
 */
export function divide(a, b) {
  if (b === 0) {
    throw new Error(ERROR_MESSAGES.DIVISION_BY_ZERO);
  }
  const factorA = Math.pow(10, getDecimalPlaces(a));
  const factorB = Math.pow(10, getDecimalPlaces(b));
  const intA = Math.round(a * factorA);
  const intB = Math.round(b * factorB);
  const result = (intA / intB) * (factorB / factorA);
  return normalizePrecision(result);
}

/**
 * Computes percentage either contextually based on previous value and operator or standalone.
 * @param {number} current 
 * @param {number|null} [prev=null] 
 * @param {string|null} [operation=null] 
 * @returns {number}
 */
export function computePercent(current, prev = null, operation = null) {
  if (prev !== null && operation !== null) {
    if (operation === '+' || operation === '-' || operation === '−') {
      // e.g. 100 + 20% => 100 * (20 / 100) = 20
      return normalizePrecision(multiply(prev, divide(current, 100)));
    }
  }
  return normalizePrecision(divide(current, 100));
}

/**
 * Inverts the sign of a number string.
 * @param {string} valStr 
 * @returns {string}
 */
export function toggleSign(valStr) {
  if (!valStr || valStr === '0' || valStr === '') return '0';
  if (valStr.startsWith('-')) {
    return valStr.slice(1);
  }
  return '-' + valStr;
}

/**
 * Executes a binary mathematical operation.
 * @param {number} a 
 * @param {number} b 
 * @param {string} op 
 * @returns {number}
 */
export function executeOperation(a, b, op) {
  switch (op) {
    case '+':
      return add(a, b);
    case '-':
    case '−':
      return subtract(a, b);
    case '*':
    case '×':
      return multiply(a, b);
    case '/':
    case '÷':
      return divide(a, b);
    default:
      throw new Error(`Unsupported operation: ${op}`);
  }
}

/**
 * Formats a numeric value for clean presentation with thousand separators.
 * @param {number|string} val 
 * @param {string} [locale='fr-FR'] 
 * @returns {string}
 */
export function formatNumberForDisplay(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' && Object.values(ERROR_MESSAGES).includes(val)) {
    return val;
  }

  const str = val.toString();
  if (str === '-') return '-';

  const parts = str.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`;
  }
  return formattedInteger;
}
