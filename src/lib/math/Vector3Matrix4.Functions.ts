import { Matrix4 } from "./Matrix4";
import { Vector3 } from "./Vector3";

export function transformPoint(m: Matrix4, v: Vector3): Vector3 {
  const x = v.x,
    y = v.y,
    z = v.z;
  const e = m.elements;

  const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

  v.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
  v.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
  v.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

  return v;
}

export function transformNormal(m: Matrix4, v: Vector3): Vector3 {
  const x = v.x,
    y = v.y,
    z = v.z;
  const e = m.elements;

  v.x = e[0] * x + e[4] * y + e[8] * z + e[12];
  v.y = e[1] * x + e[5] * y + e[9] * z + e[13];
  v.z = e[2] * x + e[6] * y + e[10] * z + e[14];

  return v;
}
