import { Mat4 } from './Mat4.js';
import { Vec3 } from './Vec3.js';

export function transformPoint3(v: Vec3, m: Mat4, result = new Vec3()): Vec3 {
  const { x } = v;
  const { y } = v;
  const { z } = v;
  const e = m.elements;

  const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

  result.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
  result.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
  result.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

  return result;
}

export function transformNormal3(v: Vec3, m: Mat4, result = new Vec3()): Vec3 {
  const { x } = v;
  const { y } = v;
  const { z } = v;
  const e = m.elements;

  result.x = e[0] * x + e[4] * y + e[8] * z;
  result.y = e[1] * x + e[5] * y + e[9] * z;
  result.z = e[2] * x + e[6] * y + e[10] * z;

  return result.normalize();
}
