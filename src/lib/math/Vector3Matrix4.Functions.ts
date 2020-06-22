import { Matrix4 } from "./Matrix4";
import { Vector3 } from "./Vector3";

export function transformPoint(v: Vector3, m: Matrix4, result = new Vector3()): Vector3 {
  const x = v.x,
    y = v.y,
    z = v.z;
  const e = m.elements;

  const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

  result.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
  result.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
  result.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

  return result;
}

export function transformNormal(v: Vector3, m: Matrix4, result = new Vector3()): Vector3 {
  const x = v.x,
    y = v.y,
    z = v.z;
  const e = m.elements;

  result.x = e[0] * x + e[4] * y + e[8] * z + e[12];
  result.y = e[1] * x + e[5] * y + e[9] * z + e[13];
  result.z = e[2] * x + e[6] * y + e[10] * z + e[14];

  return result;
}
