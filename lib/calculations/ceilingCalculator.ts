/**
 * Pure Ceiling Area Calculation Engine
 */

export interface CeilingSection {
  id: string;
  name?: string;
  length: number;
  width: number;
}

/**
 * Calculate rectangular ceiling area: Length × Width
 */
export function calculateRectangularCeilingArea(length: number, width: number): number {
  if (length <= 0 || width <= 0 || isNaN(length) || isNaN(width)) return 0;
  return length * width;
}

/**
 * Calculate square ceiling area: Side × Side
 */
export function calculateSquareCeilingArea(side: number): number {
  if (side <= 0 || isNaN(side)) return 0;
  return side * side;
}

/**
 * Calculate custom ceiling area by summing sections
 */
export function calculateCustomCeilingArea(sections: CeilingSection[]): number {
  if (!sections || sections.length === 0) return 0;
  return sections.reduce((sum, section) => {
    const area = calculateRectangularCeilingArea(section.length, section.width);
    return sum + area;
  }, 0);
}
