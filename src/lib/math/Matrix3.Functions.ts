import { Matrix3 } from "./Matrix3";
import { Vector2 } from "./Vector2";

export function makeMatrix3Translation(m: Matrix3, t: Vector2): Matrix3 {
  return m.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1);
}

export function makeMatrix3RotationFromAngle(m: Matrix3, angle: number): Matrix3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return m.set(c, -s, 0, s, c, 0, 0, 0, 1);
}

export function makeMatrix3Scale(m: Matrix3, s: Vector2): Matrix3 {
  return m.set(s.x, 0, 0, 0, s.y, 0, 0, 0, 1.0);
}
