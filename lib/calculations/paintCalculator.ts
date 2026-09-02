/**
 * Pure Paint Quantity Calculation Engine
 */

export interface PaintCalculationResult {
  basePaint: number;
  paintWithWastage: number;
  recommendedPurchase: number;
  surfaceArea: number;
  coverage: number;
  coats: number;
  wastagePercentage: number;
}

/**
 * Calculate base paint required without wastage:
 * Base Paint = Surface Area × Number of Coats ÷ Coverage
 */
export function calculateBasePaintRequired(
  surfaceArea: number,
  coverage: number,
  coats: number
): number {
  if (
    surfaceArea <= 0 ||
    coverage <= 0 ||
    coats <= 0 ||
    isNaN(surfaceArea) ||
    isNaN(coverage) ||
    isNaN(coats)
  ) {
    return 0;
  }
  return (surfaceArea * coats) / coverage;
}

/**
 * Calculate paint with wastage factor added:
 * Final Paint = Base Paint × (1 + Wastage / 100)
 */
export function calculatePaintWithWastage(
  basePaint: number,
  wastagePercentage: number
): number {
  if (basePaint <= 0 || isNaN(basePaint)) return 0;
  const safeWastage = isNaN(wastagePercentage) || wastagePercentage < 0 ? 0 : wastagePercentage;
  const factor = safeWastage > 1.0 ? safeWastage / 100.0 : safeWastage;
  return basePaint * (1.0 + factor);
}

/**
 * Calculate recommended paint purchase quantity (rounded up to whole unit)
 */
export function calculateRecommendedPurchaseQuantity(totalPaint: number): number {
  if (totalPaint <= 0 || isNaN(totalPaint)) return 0;
  return Math.ceil(totalPaint);
}

/**
 * Full paint calculation helper
 */
export function calculateFullPaintRequirement(
  surfaceArea: number,
  coverage: number,
  coats: number,
  wastagePercentage: number
): PaintCalculationResult {
  const basePaint = calculateBasePaintRequired(surfaceArea, coverage, coats);
  const paintWithWastage = calculatePaintWithWastage(basePaint, wastagePercentage);
  const recommendedPurchase = calculateRecommendedPurchaseQuantity(paintWithWastage);

  return {
    basePaint: Number(basePaint.toFixed(2)),
    paintWithWastage: Number(paintWithWastage.toFixed(2)),
    recommendedPurchase,
    surfaceArea,
    coverage,
    coats,
    wastagePercentage,
  };
}
