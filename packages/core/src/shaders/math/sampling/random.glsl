#pragma once
#pragma include <math>

// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float uvToUnitRandom(const vec2 uv0) {
  const highp float a = 12.9898,
    b = 78.233,
    c = 43758.5453;
  highp float dt = dot(uv0.xy, vec2(a, b)),
    sn = mod(dt, PI);
  return fract(sin(sn) * c);
}
