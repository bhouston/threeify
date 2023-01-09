import { Vec2 } from './Vec2.js';
import { Vec3 } from './Vec3.js';

export function makeVec2FromBaryCoordWeights(
  baryCoord: Vec3,
  a: Vec2,
  b: Vec2,
  c: Vec2,
  result = new Vec2()
): Vec2 {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z
  );
}

export function makeVec2Fit(
  frame: Vec2,
  target: Vec2,
  result = new Vec2()
): Vec2 {
  result.copy(target);
  const fitScale = Math.min(
    frame.width / result.width,
    frame.height / result.height
  );
  result.multiplyByScalar(fitScale);
  return result;
}

export function makeVec2FillHeight(
  frame: Vec2,
  target: Vec2,
  result = new Vec2()
): Vec2 {
  result.copy(target);
  const fitScale = frame.height / result.height;
  result.multiplyByScalar(fitScale);
  return result;
}

export function makeVec2Fill(
  frame: Vec2,
  target: Vec2,
  result = new Vec2()
): Vec2 {
  result.copy(target);
  const fitScale = Math.max(
    frame.width / result.width,
    frame.height / result.height
  );
  result.multiplyByScalar(fitScale);
  return result;
}
