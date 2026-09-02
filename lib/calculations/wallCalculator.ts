/**
 * Pure Wall Area Calculation Engine
 */

export interface WallItem {
  id: string;
  name?: string;
  width: number;
  height: number;
}

export interface OpeningItem {
  id: string;
  type: "door" | "window" | "custom";
  name?: string;
  width: number;
  height: number;
  quantity: number;
}

/**
 * Calculate single wall area: Width × Height
 */
export function calculateSingleWallArea(width: number, height: number): number {
  if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) return 0;
  return width * height;
}

/**
 * Calculate total area for multiple walls
 */
export function calculateMultipleWallsArea(walls: WallItem[]): number {
  if (!walls || walls.length === 0) return 0;
  return walls.reduce((sum, wall) => {
    const area = calculateSingleWallArea(wall.width, wall.height);
    return sum + area;
  }, 0);
}

/**
 * Calculate wall area for a rectangular room: 2 × (Length + Width) × Height
 */
export function calculateRoomWallArea(
  length: number,
  width: number,
  height: number
): number {
  if (
    length <= 0 ||
    width <= 0 ||
    height <= 0 ||
    isNaN(length) ||
    isNaN(width) ||
    isNaN(height)
  ) {
    return 0;
  }
  return 2 * (length + width) * height;
}

/**
 * Calculate area of a single opening: Width × Height × Quantity
 */
export function calculateOpeningArea(
  width: number,
  height: number,
  quantity: number
): number {
  if (
    width <= 0 ||
    height <= 0 ||
    quantity <= 0 ||
    isNaN(width) ||
    isNaN(height) ||
    isNaN(quantity)
  ) {
    return 0;
  }
  return width * height * quantity;
}

/**
 * Calculate total area of all openings
 */
export function calculateTotalOpeningsArea(openings: OpeningItem[]): number {
  if (!openings || openings.length === 0) return 0;
  return openings.reduce((sum, op) => {
    const area = calculateOpeningArea(op.width, op.height, op.quantity);
    return sum + area;
  }, 0);
}

/**
 * Calculate net paintable wall area: Total Wall Area - Total Opening Area
 */
export function calculatePaintableWallArea(
  grossWallArea: number,
  totalOpeningArea: number
): number {
  if (grossWallArea <= 0 || isNaN(grossWallArea)) return 0;
  const safeOpenings = isNaN(totalOpeningArea) || totalOpeningArea < 0 ? 0 : totalOpeningArea;
  const net = grossWallArea - safeOpenings;
  return net > 0 ? net : 0;
}
