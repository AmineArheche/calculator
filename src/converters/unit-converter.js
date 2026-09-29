/**
 * Unit Converter Engine
 * Length, temperature, mass, and digital storage conversion utilities.
 */

export class UnitConverter {
  // Length in meters
  static LENGTH_FACTORS = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  };

  // Mass in kilograms
  static MASS_FACTORS = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523125,
  };

  // Data in bytes
  static DATA_FACTORS = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  convertLength(value, fromUnit, toUnit) {
    const fFrom = UnitConverter.LENGTH_FACTORS[fromUnit];
    const fTo = UnitConverter.LENGTH_FACTORS[toUnit];
    if (!fFrom || !fTo) throw new Error('Unsupported length unit');
    return Number(((value * fFrom) / fTo).toFixed(8));
  }

  convertMass(value, fromUnit, toUnit) {
    const fFrom = UnitConverter.MASS_FACTORS[fromUnit];
    const fTo = UnitConverter.MASS_FACTORS[toUnit];
    if (!fFrom || !fTo) throw new Error('Unsupported mass unit');
    return Number(((value * fFrom) / fTo).toFixed(8));
  }

  convertData(value, fromUnit, toUnit) {
    const fFrom = UnitConverter.DATA_FACTORS[fromUnit];
    const fTo = UnitConverter.DATA_FACTORS[toUnit];
    if (!fFrom || !fTo) throw new Error('Unsupported data unit');
    return Number(((value * fFrom) / fTo).toFixed(8));
  }

  convertTemperature(value, fromUnit, toUnit) {
    const uFrom = fromUnit.toUpperCase();
    const uTo = toUnit.toUpperCase();

    let celsius = 0;
    if (uFrom === 'C') celsius = value;
    else if (uFrom === 'F') celsius = (value - 32) * (5 / 9);
    else if (uFrom === 'K') celsius = value - 273.15;
    else throw new Error('Unsupported temperature unit');

    let result = 0;
    if (uTo === 'C') result = celsius;
    else if (uTo === 'F') result = (celsius * 9) / 5 + 32;
    else if (uTo === 'K') result = celsius + 273.15;
    else throw new Error('Unsupported temperature unit');

    return Number(result.toFixed(4));
  }
}
