// Shared pergola centres in each original 1024 × 1536 island artwork.
export const commonAnchors = [
  { x: 0.52, y: 0.35 },
  { x: 0.5, y: 0.44 },
  { x: 0.5, y: 0.42 },
  { x: 0.5, y: 0.45 },
  { x: 0.5, y: 0.44 },
  { x: 0.5, y: 0.46 },
  { x: 0.5, y: 0.44 },
  { x: 0.5, y: 0.44 },
  { x: 0.5, y: 0.5 },
  { x: 0.5, y: 0.45 },
  { x: 0.5, y: 0.5 },
  { x: 0.5, y: 0.39 },
];
export function coveredPoint(
  width: number,
  height: number,
  anchor: { x: number; y: number },
) {
  const scale = Math.max(width / 1024, height / 1536);
  return {
    x: (width - 1024 * scale) / 2 + anchor.x * 1024 * scale,
    y: (height - 1536 * scale) / 2 + anchor.y * 1536 * scale,
  };
}
