// Takes a layer size, optional offset, and if the layer is a texture or framebuffer.

import { Mat3 } from '../../math/Mat3';
import {
  mat3Identity,
  mat3Multiply,
  scale2ToMat3,
  translation2ToMat3
} from '../../math/Mat3.Functions';
import { Vec2 } from '../../math/Vec2';
import { vec2Negate } from '../../math/Vec2.Functions';

// Returns a matrix that transforms from image coordinates ( (0,0) in top left ) to UV coordinates for that layer.
export function viewToMat3LayerUv(
  layerSize: Vec2,
  layerOffset: Vec2 | undefined,
  layerIsFramebuffer = false,
  result = new Mat3()
): Mat3 {
  if (layerOffset == null) {
    mat3Identity(result);
  } else {
    translation2ToMat3(vec2Negate(layerOffset), result);
  }

  const invScale = scale2ToMat3(new Vec2(1 / layerSize.x, 1 / layerSize.y));
  result = mat3Multiply(invScale, result, result);

  if (layerIsFramebuffer) {
    // Performs "vec2( pos.x, 1.0 - pos.y );"
    const flipY = new Mat3([1, 0, 0, 0, -1, 1, 0, 0, 1]);
    result = mat3Multiply(flipY, result, result);
  }

  return result;
}
