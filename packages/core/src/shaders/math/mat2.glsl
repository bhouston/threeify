#pragma once

mat2 mat2Identity() {
  return mat2(1., 0., 0., 1.);
}

mat2 mat2RotateDirection(const vec2 dir) {
  return mat2(dir.x, -dir.y, dir.y, dir.x);
}

// validated - this is the same as the TS makeMat3RotationFromAngle
mat2 mat2Rotate(const float angle) {
  return mat2RotateDirection(vec2(cos(angle), sin(angle)));
}

// validated - this is the same as the TS scale2ToMat3
mat2 mat2Scale(const vec2 scale) {
  return mat2(scale.x, 0., scale.y, 0);
}
