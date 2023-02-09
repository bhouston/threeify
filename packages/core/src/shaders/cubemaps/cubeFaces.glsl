#pragma once

// reference: https://github.com/tmarrinan/cube2equirect
void directionToCubeFaceUV(vec3 dir, out int face, out vec2 uv0) {
  vec3 temp;

  // X dominant
  if (abs(dir.x) >= abs(dir.y) && abs(dir.x) >= abs(dir.z)) {
    if (dir.x < 0.) {
      temp = vec3(dir.z, dir.y, -dir.x);
      face = 1; // left
    } else {
      temp = vec3(-dir.z, dir.y, dir.x);
      face = 0; // right
    }
  } // Y dominant
  else if (abs(dir.y) >= abs(dir.z)) {
    if (dir.y < 0.) {
      temp = vec3(dir.x, dir.z, -dir.y);
      face = 3; // top
    } else {
      temp = vec3(dir.x, -dir.z, dir.y);
      face = 2; // bottom
    }
  } // Z domnant
  else {
    if (dir.z < 0.) {
      temp = vec3(dir.x, -dir.y, dir.z);
      face = 5; // back
    } else {
      temp = vec3(dir.x, dir.y, dir.z);
      face = 4; // front
    }
  }

  // world to face clip space
  vec2 clipXY = temp.xy / temp.z;

  // clip space to texture space
  uv0 = clipXY * 0.5 + 0.5;
}

// Ben believes this is good based on the visual results.
vec3 cubeFaceUVToDirection(int face, vec2 uv0) {
  // texture space to clip space.
  vec2 clipXY = uv0 * 2. - 1.;

  vec3 result;
  if (face == 0) {
    result = vec3(-1., clipXY.y, -clipXY.x); // Back
  } else if (face == 1) {
    result = vec3(1., clipXY.y, clipXY.x); // Front
  } else if (face == 2) {
    result = vec3(clipXY.x, -1., -clipXY.y); // Top
  } else if (face == 3) {
    result = vec3(clipXY.x, 1., clipXY.y);  // Bottom
  } else if (face == 4) {
    result = vec3(clipXY.x, clipXY.y, -1.);  // Left
  } else {
    result = vec3(-clipXY.x, clipXY.y, 1.);  // right
  }

  //result.x *= -1.;
  return normalize(result);
}
