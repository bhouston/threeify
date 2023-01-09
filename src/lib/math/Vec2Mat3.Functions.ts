import { Mat3 } from './Mat3.js';
import { Vec2 } from './Vec2.js';

export function transformPoint2(v: Vec2, m: Mat3, result = new Vec2()): Vec2 {
  const { x } = v;
  const { y } = v;
  const e = m.elements;

  const w = 1 / (e[2] * x + e[5] * y + e[8]);

  result.x = (e[0] * x + e[3] * y + e[6]) * w;
  result.y = (e[1] * x + e[4] * y + e[7]) * w;

  return result;
}

export function transformDirection2(
  v: Vec2,
  m: Mat3,
  result = new Vec2()
): Vec2 {
  const { x } = v;
  const { y } = v;
  const e = m.elements;

  result.x = e[0] * x + e[3] * y;
  result.y = e[1] * x + e[4] * y;

  return result.normalize();
}
