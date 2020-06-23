import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";

export function makeVector2FromBaryCoordWeights(
  baryCoord: Vector3,
  a: Vector2,
  b: Vector2,
  c: Vector2,
  result = new Vector2(),
): Vector2 {
  const v = baryCoord;
  return result.set(a.x * v.x + b.x * v.y + c.x * v.z, a.y * v.x + b.y * v.y + c.y * v.z);
}
