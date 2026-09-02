/**
 * Pure Cost Estimation Engine
 */

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CostCalculationBreakdown {
  paintCost: number;
  primerCost: number;
  laborCost: number;
  materialsCost: number;
  totalCost: number;
}

/**
 * Calculate Paint Cost: Quantity × Price
 */
export function calculatePaintCost(quantity: number, pricePerUnit: number): number {
  if (quantity <= 0 || pricePerUnit <= 0 || isNaN(quantity) || isNaN(pricePerUnit)) return 0;
  return quantity * pricePerUnit;
}

/**
 * Calculate Primer Cost: Quantity × Price
 */
export function calculatePrimerCost(
  includePrimer: boolean,
  quantity: number,
  pricePerUnit: number
): number {
  if (!includePrimer) return 0;
  if (quantity <= 0 || pricePerUnit <= 0 || isNaN(quantity) || isNaN(pricePerUnit)) return 0;
  return quantity * pricePerUnit;
}

/**
 * Calculate Labor Cost: Area × Rate OR Total Fixed Cost
 */
export function calculateLaborCost(
  paintableArea: number,
  ratePerUnitArea: number,
  isFixedLabor: boolean,
  fixedLaborTotal: number
): number {
  if (isFixedLabor) {
    if (fixedLaborTotal < 0 || isNaN(fixedLaborTotal)) return 0;
    return fixedLaborTotal;
  }
  if (paintableArea <= 0 || ratePerUnitArea <= 0 || isNaN(paintableArea) || isNaN(ratePerUnitArea)) {
    return 0;
  }
  return paintableArea * ratePerUnitArea;
}

/**
 * Calculate total cost of additional materials: sum of (quantity × unitPrice)
 */
export function calculateMaterialsCost(materials: MaterialItem[]): number {
  if (!materials || materials.length === 0) return 0;
  return materials.reduce((sum, item) => {
    const qty = isNaN(item.quantity) || item.quantity < 0 ? 0 : item.quantity;
    const price = isNaN(item.unitPrice) || item.unitPrice < 0 ? 0 : item.unitPrice;
    return sum + qty * price;
  }, 0);
}

/**
 * Calculate Total Estimated Cost
 */
export function calculateTotalProjectCost(
  paintCost: number,
  primerCost: number,
  laborCost: number,
  materialsCost: number
): CostCalculationBreakdown {
  const safePaint = Math.max(0, isNaN(paintCost) ? 0 : paintCost);
  const safePrimer = Math.max(0, isNaN(primerCost) ? 0 : primerCost);
  const safeLabor = Math.max(0, isNaN(laborCost) ? 0 : laborCost);
  const safeMaterials = Math.max(0, isNaN(materialsCost) ? 0 : materialsCost);

  const totalCost = safePaint + safePrimer + safeLabor + safeMaterials;

  return {
    paintCost: safePaint,
    primerCost: safePrimer,
    laborCost: safeLabor,
    materialsCost: safeMaterials,
    totalCost,
  };
}
