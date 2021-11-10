/**
 * Get coordinates {x,y} given a radius, angle (rad) and offset values
 * @param {Object} config { radius, angle(rad), offset }
 * @returns Coords
 */
export function getSpiderCoord({ radius = 10, angle, offset }) {
  return {
    x: radius * Math.sin(angle + offset),
    y: radius * Math.cos(angle + offset),
  };
}
