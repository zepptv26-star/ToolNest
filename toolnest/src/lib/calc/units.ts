import { fail, ok, type Result } from './result.ts';

export interface Unit { id: string; label: string; factor: number } // factor = size of 1 unit in the category's base unit
export interface UnitCategory { id: string; label: string; base: string; units: Unit[] }

export const unitCategories: UnitCategory[] = [
  { id: 'length', label: 'Length', base: 'metre', units: [
    { id: 'mm', label: 'Millimetre (mm)', factor: 0.001 }, { id: 'cm', label: 'Centimetre (cm)', factor: 0.01 },
    { id: 'm', label: 'Metre (m)', factor: 1 }, { id: 'km', label: 'Kilometre (km)', factor: 1000 },
    { id: 'in', label: 'Inch (in)', factor: 0.0254 }, { id: 'ft', label: 'Foot (ft)', factor: 0.3048 },
    { id: 'yd', label: 'Yard (yd)', factor: 0.9144 }, { id: 'mi', label: 'Mile (mi)', factor: 1609.344 },
    { id: 'nmi', label: 'Nautical mile (nmi)', factor: 1852 }
  ] },
  { id: 'weight', label: 'Weight (mass)', base: 'kilogram', units: [
    { id: 'mg', label: 'Milligram (mg)', factor: 1e-6 }, { id: 'g', label: 'Gram (g)', factor: 0.001 },
    { id: 'kg', label: 'Kilogram (kg)', factor: 1 }, { id: 't', label: 'Metric tonne (t)', factor: 1000 },
    { id: 'oz', label: 'Ounce (oz)', factor: 0.028349523125 }, { id: 'lb', label: 'Pound (lb)', factor: 0.45359237 },
    { id: 'st', label: 'Stone (st)', factor: 6.35029318 }
  ] },
  { id: 'area', label: 'Area', base: 'square metre', units: [
    { id: 'cm2', label: 'Square centimetre (cm²)', factor: 1e-4 }, { id: 'm2', label: 'Square metre (m²)', factor: 1 },
    { id: 'ha', label: 'Hectare (ha)', factor: 10000 }, { id: 'km2', label: 'Square kilometre (km²)', factor: 1e6 },
    { id: 'in2', label: 'Square inch (in²)', factor: 0.00064516 }, { id: 'ft2', label: 'Square foot (ft²)', factor: 0.09290304 },
    { id: 'yd2', label: 'Square yard (yd²)', factor: 0.83612736 }, { id: 'ac', label: 'Acre (ac)', factor: 4046.8564224 },
    { id: 'mi2', label: 'Square mile (mi²)', factor: 2589988.110336 }
  ] },
  { id: 'volume', label: 'Volume', base: 'litre', units: [
    { id: 'ml', label: 'Millilitre (mL)', factor: 0.001 }, { id: 'l', label: 'Litre (L)', factor: 1 },
    { id: 'm3', label: 'Cubic metre (m³)', factor: 1000 },
    { id: 'tsp', label: 'Teaspoon (US)', factor: 0.00492892159375 }, { id: 'tbsp', label: 'Tablespoon (US)', factor: 0.01478676478125 },
    { id: 'floz', label: 'Fluid ounce (US)', factor: 0.0295735295625 }, { id: 'cup', label: 'Cup (US)', factor: 0.2365882365 },
    { id: 'pt', label: 'Pint (US)', factor: 0.473176473 }, { id: 'qt', label: 'Quart (US)', factor: 0.946352946 },
    { id: 'gal', label: 'Gallon (US)', factor: 3.785411784 }, { id: 'galuk', label: 'Gallon (UK)', factor: 4.54609 }
  ] },
  { id: 'speed', label: 'Speed', base: 'metre per second', units: [
    { id: 'ms', label: 'Metres per second (m/s)', factor: 1 }, { id: 'kmh', label: 'Kilometres per hour (km/h)', factor: 1 / 3.6 },
    { id: 'mph', label: 'Miles per hour (mph)', factor: 0.44704 }, { id: 'kn', label: 'Knots (kn)', factor: 1852 / 3600 },
    { id: 'fts', label: 'Feet per second (ft/s)', factor: 0.3048 }
  ] },
  { id: 'pressure', label: 'Pressure', base: 'pascal', units: [
    { id: 'pa', label: 'Pascal (Pa)', factor: 1 }, { id: 'kpa', label: 'Kilopascal (kPa)', factor: 1000 },
    { id: 'bar', label: 'Bar', factor: 100000 }, { id: 'psi', label: 'Pound per square inch (psi)', factor: 6894.757293168 },
    { id: 'atm', label: 'Atmosphere (atm)', factor: 101325 }, { id: 'mmhg', label: 'Millimetre of mercury (mmHg)', factor: 133.322387415 },
    { id: 'inhg', label: 'Inch of mercury (inHg)', factor: 3386.389 }
  ] }
];

export function convertUnit(categoryId: string, value: number, fromId: string, toId: string): Result<number> {
  const cat = unitCategories.find((c) => c.id === categoryId);
  if (!cat) return fail('Unknown unit category.');
  const from = cat.units.find((u) => u.id === fromId);
  const to = cat.units.find((u) => u.id === toId);
  if (!from || !to) return fail('Unknown unit.');
  if (!Number.isFinite(value)) return fail('Enter a valid number.');
  return ok((value * from.factor) / to.factor);
}
