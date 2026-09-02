/**
 * Unit Conversion definitions and utilities
 */

export type UnitSystem = "metric" | "imperial";

export type MetricLengthUnit = "m" | "cm" | "mm";
export type ImperialLengthUnit = "ft" | "in" | "yd";
export type LengthUnit = MetricLengthUnit | ImperialLengthUnit;

export type AreaUnit = "m²" | "sq ft";
export type VolumeUnit = "L" | "gal";
export type CoverageUnit = "m²/L" | "sq ft/gal";

export const METERS_TO_FEET = 3.28084;
export const FEET_TO_METERS = 1 / METERS_TO_FEET;

export const SQ_METERS_TO_SQ_FEET = 10.76391;
export const SQ_FEET_TO_SQ_METERS = 1 / SQ_METERS_TO_SQ_FEET;

export const LITERS_TO_GALLONS = 0.264172;
export const GALLONS_TO_LITERS = 1 / LITERS_TO_GALLONS;

/**
 * Convert any length to the base unit of its system (meter for metric, foot for imperial)
 */
export function toBaseLength(value: number, unit: LengthUnit): number {
  if (value <= 0 || isNaN(value)) return 0;
  switch (unit) {
    case "m":
      return value;
    case "cm":
      return value / 100;
    case "mm":
      return value / 1000;
    case "ft":
      return value;
    case "in":
      return value / 12;
    case "yd":
      return value * 3;
    default:
      return value;
  }
}

/**
 * Convert length between metric (meters) and imperial (feet)
 */
export function convertLength(value: number, toImperial: boolean): number {
  if (value <= 0 || isNaN(value)) return 0;
  return toImperial ? value * METERS_TO_FEET : value * FEET_TO_METERS;
}

/**
 * Convert area between metric (sq meters) and imperial (sq feet)
 */
export function convertArea(value: number, toImperial: boolean): number {
  if (value <= 0 || isNaN(value)) return 0;
  return toImperial ? value * SQ_METERS_TO_SQ_FEET : value * SQ_FEET_TO_SQ_METERS;
}

/**
 * Convert volume between metric (liters) and imperial (gallons)
 */
export function convertVolume(value: number, toImperial: boolean): number {
  if (value <= 0 || isNaN(value)) return 0;
  return toImperial ? value * LITERS_TO_GALLONS : value * GALLONS_TO_LITERS;
}

/**
 * Convert coverage between m²/L and sq ft/gal
 * 1 m²/L = 10.76391 sq ft / (1 / 3.78541 gal) ≈ 40.7458 sq ft/gal
 */
export const COVERAGE_M2_PER_L_TO_SQFT_PER_GAL = 40.7458;

export function convertCoverage(value: number, toImperial: boolean): number {
  if (value <= 0 || isNaN(value)) return 0;
  return toImperial
    ? value * COVERAGE_M2_PER_L_TO_SQFT_PER_GAL
    : value / COVERAGE_M2_PER_L_TO_SQFT_PER_GAL;
}
