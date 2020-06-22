import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";

export function makeVector2FromBarycoordWeights(
  baryCoord: Vector3,
  a: Vector2,
  b: Vector2,
  c: Vector2,
  result = new Vector2(),
): Vector2 {
  result.x = a.x * baryCoord.x + b.x * baryCoord.y + c.x * baryCoord.z;
  result.y = a.y * baryCoord.x + b.y * baryCoord.y + c.y * baryCoord.z;
  return result;
}
