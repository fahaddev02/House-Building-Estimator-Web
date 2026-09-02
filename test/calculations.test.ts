import { describe, it, expect } from "vitest";
import {
  calculateSingleWallArea,
  calculateMultipleWallsArea,
  calculateRoomWallArea,
  calculateOpeningArea,
  calculateTotalOpeningsArea,
  calculatePaintableWallArea,
} from "../lib/calculations/wallCalculator";
import {
  calculateRectangularCeilingArea,
  calculateSquareCeilingArea,
  calculateCustomCeilingArea,
} from "../lib/calculations/ceilingCalculator";
import {
  calculateBasePaintRequired,
  calculatePaintWithWastage,
  calculateRecommendedPurchaseQuantity,
  calculateFullPaintRequirement,
} from "../lib/calculations/paintCalculator";
import {
  calculatePaintCost,
  calculatePrimerCost,
  calculateLaborCost,
  calculateMaterialsCost,
  calculateTotalProjectCost,
} from "../lib/calculations/costCalculator";
import {
  convertLength,
  convertArea,
  convertVolume,
  toBaseLength,
} from "../lib/calculations/unitConversion";
import { formatCurrency } from "../lib/calculations/currency";

describe("Wall Calculator Engine", () => {
  it("calculates single wall area correctly (5m × 3m = 15m²)", () => {
    expect(calculateSingleWallArea(5, 3)).toBe(15);
  });

  it("calculates rectangular room wall area correctly (5m × 4m × 3m = 54m²)", () => {
    // 2 × (5 + 4) × 3 = 2 × 9 × 3 = 54m²
    expect(calculateRoomWallArea(5, 4, 3)).toBe(54);
  });

  it("calculates multiple walls area correctly", () => {
    const walls = [
      { id: "1", name: "Wall 1", width: 5, height: 3 }, // 15
      { id: "2", name: "Wall 2", width: 4, height: 3 }, // 12
    ];
    expect(calculateMultipleWallsArea(walls)).toBe(27);
  });

  it("calculates opening area correctly (Width=1m, Height=2m, Qty=2 = 4m²)", () => {
    expect(calculateOpeningArea(1, 2, 2)).toBe(4);
  });

  it("deducts doors and windows from wall area (54m² - 5m² = 49m²)", () => {
    const openings = [
      { id: "1", type: "door" as const, width: 1, height: 2, quantity: 1 }, // 2m²
      { id: "2", type: "window" as const, width: 1.5, height: 2, quantity: 1 }, // 3m²
    ];
    const totalOpenings = calculateTotalOpeningsArea(openings);
    expect(totalOpenings).toBe(5);

    const netPaintable = calculatePaintableWallArea(54, totalOpenings);
    expect(netPaintable).toBe(49);
  });

  it("handles negative and zero values safely", () => {
    expect(calculateSingleWallArea(-5, 3)).toBe(0);
    expect(calculateSingleWallArea(0, 3)).toBe(0);
    expect(calculateRoomWallArea(-5, 4, 3)).toBe(0);
    expect(calculateOpeningArea(1, -2, 1)).toBe(0);
    expect(calculateOpeningArea(1, 2, -1)).toBe(0);
    expect(calculatePaintableWallArea(10, 20)).toBe(0); // openings exceed gross wall
  });
});

describe("Ceiling Calculator Engine", () => {
  it("calculates rectangular ceiling area (5m × 4m = 20m²)", () => {
    expect(calculateRectangularCeilingArea(5, 4)).toBe(20);
  });

  it("calculates square ceiling area (4m × 4m = 16m²)", () => {
    expect(calculateSquareCeilingArea(4)).toBe(16);
  });

  it("calculates custom ceiling sections sum", () => {
    const sections = [
      { id: "1", length: 4, width: 3 }, // 12
      { id: "2", length: 2, width: 2 }, // 4
    ];
    expect(calculateCustomCeilingArea(sections)).toBe(16);
  });

  it("handles invalid inputs safely", () => {
    expect(calculateRectangularCeilingArea(-5, 4)).toBe(0);
    expect(calculateSquareCeilingArea(0)).toBe(0);
  });
});

describe("Paint Calculator Engine", () => {
  it("calculates paint required accurately with wastage (49m², 2 coats, 10m²/L, 10% wastage)", () => {
    // Base: 49 × 2 / 10 = 9.8 L
    const basePaint = calculateBasePaintRequired(49, 10, 2);
    expect(basePaint).toBe(9.8);

    // Final with 10% wastage: 9.8 × 1.10 = 10.78 L
    const paintWithWastage = calculatePaintWithWastage(basePaint, 10);
    expect(paintWithWastage).toBeCloseTo(10.78, 2);

    // Recommended purchase: 11 L
    const recommended = calculateRecommendedPurchaseQuantity(paintWithWastage);
    expect(recommended).toBe(11);

    const full = calculateFullPaintRequirement(49, 10, 2, 10);
    expect(full.basePaint).toBe(9.8);
    expect(full.paintWithWastage).toBe(10.78);
    expect(full.recommendedPurchase).toBe(11);
  });

  it("handles edge cases in paint calculation", () => {
    expect(calculateBasePaintRequired(-49, 10, 2)).toBe(0);
    expect(calculateBasePaintRequired(49, 0, 2)).toBe(0);
    expect(calculateBasePaintRequired(49, 10, -1)).toBe(0);
    expect(calculatePaintWithWastage(0, 10)).toBe(0);
  });
});

describe("Cost Calculator Engine", () => {
  it("calculates paint cost correctly (11L × PKR 2,500 = PKR 27,500)", () => {
    expect(calculatePaintCost(11, 2500)).toBe(27500);
  });

  it("calculates primer cost when enabled", () => {
    expect(calculatePrimerCost(true, 5, 1000)).toBe(5000);
    expect(calculatePrimerCost(false, 5, 1000)).toBe(0);
  });

  it("calculates labor cost (rate per m² or manual total)", () => {
    // 49m² × 150/m² = 7350
    expect(calculateLaborCost(49, 150, false, 0)).toBe(7350);
    // Manual total = 8000
    expect(calculateLaborCost(49, 150, true, 8000)).toBe(8000);
  });

  it("calculates materials cost accurately", () => {
    const materials = [
      { id: "1", name: "Roller", quantity: 2, unitPrice: 500 }, // 1000
      { id: "2", name: "Tape", quantity: 5, unitPrice: 200 }, // 1000
    ];
    expect(calculateMaterialsCost(materials)).toBe(2000);
  });

  it("calculates total project cost breakdown matching the example (Total = PKR 40,000)", () => {
    // Paint = 25,000, Primer = 5,000, Labor = 8,000, Materials = 2,000 -> Total = 40,000
    const result = calculateTotalProjectCost(25000, 5000, 8000, 2000);
    expect(result.paintCost).toBe(25000);
    expect(result.primerCost).toBe(5000);
    expect(result.laborCost).toBe(8000);
    expect(result.materialsCost).toBe(2000);
    expect(result.totalCost).toBe(40000);
  });
});

describe("Unit Conversion & Currency Engine", () => {
  it("converts units accurately", () => {
    expect(convertLength(1, true)).toBeCloseTo(3.28084, 4);
    expect(convertArea(1, true)).toBeCloseTo(10.76391, 4);
    expect(convertVolume(1, true)).toBeCloseTo(0.264172, 4);

    expect(toBaseLength(100, "cm")).toBe(1);
    expect(toBaseLength(1000, "mm")).toBe(1);
    expect(toBaseLength(12, "in")).toBe(1);
    expect(toBaseLength(1, "yd")).toBe(3);
  });

  it("formats currency correctly", () => {
    expect(formatCurrency(40000, "PKR")).toBe("Rs 40,000");
    expect(formatCurrency(250, "USD")).toBe("$ 250");
    expect(formatCurrency(199, "EUR")).toBe("€ 199");
  });
});
