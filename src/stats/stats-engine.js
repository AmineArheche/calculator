/**
 * Statistical Analysis & Summary Engine
 * Calculates mean, median, mode, variance, and standard deviation.
 */

export class StatsEngine {
  validate(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
      throw new Error('Input must be a non-empty array of numbers');
    }
    return numbers.map(Number);
  }

  mean(numbers) {
    const arr = this.validate(numbers);
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return Number((sum / arr.length).toFixed(8));
  }

  median(numbers) {
    const arr = this.validate(numbers).sort((a, b) => a - b);
    const mid = Math.floor(arr.length / 2);
    if (arr.length % 2 !== 0) {
      return arr[mid];
    }
    return Number(((arr[mid - 1] + arr[mid]) / 2).toFixed(8));
  }

  mode(numbers) {
    const arr = this.validate(numbers);
    const freq = {};
    let maxFreq = 0;

    arr.forEach((num) => {
      freq[num] = (freq[num] || 0) + 1;
      if (freq[num] > maxFreq) maxFreq = freq[num];
    });

    const modes = Object.keys(freq)
      .filter((k) => freq[k] === maxFreq)
      .map(Number);

    return modes.sort((a, b) => a - b);
  }

  range(numbers) {
    const arr = this.validate(numbers);
    return Math.max(...arr) - Math.min(...arr);
  }

  variance(numbers, isSample = false) {
    const arr = this.validate(numbers);
    if (isSample && arr.length <= 1) {
      throw new Error('Sample variance requires at least 2 observations');
    }
    const avg = this.mean(arr);
    const sumSqDiff = arr.reduce((acc, val) => acc + (val - avg) ** 2, 0);
    const divisor = isSample ? arr.length - 1 : arr.length;
    return Number((sumSqDiff / divisor).toFixed(8));
  }

  standardDeviation(numbers, isSample = false) {
    return Number(Math.sqrt(this.variance(numbers, isSample)).toFixed(8));
  }
}
