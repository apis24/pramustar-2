import { SemaphorePose } from '../types';

/**
 * Semaphore flag positions for each letter
 * Each position defines the angles of the left and right arms
 * Angles are measured from vertical, with positive being clockwise
 */

export interface ArmPosition {
  leftArm: number;  // Angle in degrees
  rightArm: number; // Angle in degrees
}

export const SEMAPHORE_POSITIONS: Record<SemaphorePose, ArmPosition> = {
  // Ready position - both arms down
  READY: { leftArm: 0, rightArm: 0 },

  // A - Both arms straight up
  A: { leftArm: 180, rightArm: 180 },

  // B - Left arm up, right arm down-left
  B: { leftArm: 180, rightArm: 45 },

  // C - Left arm up, right arm horizontal left
  C: { leftArm: 180, rightArm: 90 },

  // D - Left arm up, right arm up-left
  D: { leftArm: 180, rightArm: 135 },

  // E - Left arm up-right, right arm up-left
  E: { leftArm: 225, rightArm: 135 },

  // F - Left arm horizontal right, right arm up-left
  F: { leftArm: 270, rightArm: 135 },

  // G - Left arm down-right, right arm up-left
  G: { leftArm: 315, rightArm: 135 },

  // H - Left arm down, right arm up-left
  H: { leftArm: 0, rightArm: 135 },

  // I - Left arm down-left, right arm up-left
  I: { leftArm: 45, rightArm: 135 },

  // J - Left arm horizontal left, right arm up-left
  J: { leftArm: 90, rightArm: 135 },

  // K - Left arm horizontal left, right arm up
  K: { leftArm: 90, rightArm: 180 },

  // L - Left arm horizontal left, right arm up-right
  L: { leftArm: 90, rightArm: 225 },

  // M - Left arm horizontal left, right arm horizontal right
  M: { leftArm: 90, rightArm: 270 },

  // N - Left arm horizontal left, right arm down-right
  N: { leftArm: 90, rightArm: 315 },

  // O - Left arm horizontal left, right arm down
  O: { leftArm: 90, rightArm: 0 },

  // P - Left arm up-left, right arm down
  P: { leftArm: 135, rightArm: 0 },

  // Q - Left arm up-left, right arm down-left
  Q: { leftArm: 135, rightArm: 45 },

  // R - Left arm up-left, right arm horizontal left
  R: { leftArm: 135, rightArm: 90 },

  // S - Both arms up-left
  S: { leftArm: 135, rightArm: 135 },

  // T - Left arm up, right arm horizontal left
  T: { leftArm: 180, rightArm: 90 },

  // U - Left arm up, right arm down-left
  U: { leftArm: 180, rightArm: 45 },

  // V - Left arm up, right arm down
  V: { leftArm: 180, rightArm: 0 },

  // W - Left arm up, right arm down-right
  W: { leftArm: 180, rightArm: 315 },

  // X - Left arm up, right arm horizontal right
  X: { leftArm: 180, rightArm: 270 },

  // Y - Left arm up, right arm up-right
  Y: { leftArm: 180, rightArm: 225 },

  // Z - Left arm up-left, right arm up
  Z: { leftArm: 135, rightArm: 180 },
};

/**
 * Convert arm angles to SVG coordinates
 * @param angle Angle in degrees from vertical
 * @param armLength Length of the arm in SVG units
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @returns [x, y] coordinates
 */
export const angleToCoordinates = (
  angle: number,
  armLength: number,
  centerX: number,
  centerY: number
): [number, number] => {
  // Convert angle to radians (adjust for SVG coordinate system)
  const radians = ((angle - 90) * Math.PI) / 180;

  const x = centerX + armLength * Math.cos(radians);
  const y = centerY + armLength * Math.sin(radians);

  return [x, y];
};