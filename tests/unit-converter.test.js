import { describe, it, expect } from 'vitest';
import { UnitConverter } from '../src/converters/unit-converter.js';

describe('UnitConverter Service', () => {
  const conv = new UnitConverter();

  it('converts meters to kilometers and feet accurately', () => {
    expect(conv.convertLength(1000, 'm', 'km')).toBe(1);
    expect(conv.convertLength(1, 'ft', 'in')).toBe(12);
  });

  it('converts kilograms to grams and pounds', () => {
    expect(conv.convertMass(1, 'kg', 'g')).toBe(1000);
    expect(conv.convertMass(1, 'lb', 'oz')).toBe(16);
  });

  it('converts temperatures across Celsius, Fahrenheit, and Kelvin', () => {
    expect(conv.convertTemperature(0, 'C', 'F')).toBe(32);
    expect(conv.convertTemperature(100, 'C', 'F')).toBe(212);
    expect(conv.convertTemperature(0, 'C', 'K')).toBe(273.15);
    expect(conv.convertTemperature(32, 'F', 'C')).toBe(0);
  });

  it('converts data storage units accurately', () => {
    expect(conv.convertData(1024, 'MB', 'GB')).toBe(1);
    expect(conv.convertData(1, 'KB', 'B')).toBe(1024);
  });

  it('throws on unsupported units', () => {
    expect(() => conv.convertLength(10, 'm', 'lightyear')).toThrow();
  });
});
