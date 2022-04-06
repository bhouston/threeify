import { Matrix3 } from "../../math";
import { makeMatrix3Concatenation, makeMatrix3Scale, makeMatrix3Translation } from "../../math/Matrix3.Functions";
import { Vector2 } from "../../math/Vector2";

// Takes a layer size, optional offset, and if the layer is a texture or framebuffer.
// Returns a matrix that transforms from image coordinates ( (0,0) in top left ) to UV coordinates for that layer.
export function makeMatrix3FromViewToLayerUv(
  layerSize: Vector2,
  layerOffset: Vector2 | undefined,
  layerIsFramebuffer: boolean = false,
  result = new Matrix3(),
): Matrix3 {
  if (layerOffset == null) {
    result.makeIdentity();
  } else {
    makeMatrix3Translation(layerOffset.clone().negate(), result);
  }

  const invScale = makeMatrix3Scale(new Vector2(1 / layerSize.x, 1 / layerSize.y));
  result = makeMatrix3Concatenation(invScale, result, result);

  if (layerIsFramebuffer) {
    // Performs "vec2( pos.x, 1.0 - pos.y );"
    const flipY = new Matrix3().set(1, 0, 0, 0, -1, 1, 0, 0, 1);
    result = makeMatrix3Concatenation(flipY, result, result);
  }

  return result;
}
