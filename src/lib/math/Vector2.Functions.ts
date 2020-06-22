import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";

export function makeVector2FromBaryCoordWeights(
  BaryCoord: Vector3,
  a: Vector2,
  b: Vector2,
  c: Vector2,
  result = new Vector2(),
): Vector2 {
  result.x = a.x * BaryCoord.x + b.x * BaryCoord.y + c.x * BaryCoord.z;
  result.y = a.y * BaryCoord.x + b.y * BaryCoord.y + c.y * BaryCoord.z;
  return result;
}
