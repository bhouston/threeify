#pragma once

// reference: http://iwasbeingirony.blogspot.ca/2010/06/difference-between-rgbm-and-rgbd.html
vec3 rgbdToLinear(vec4 value, float maxRange) {
  return vec3(value.rgb * (maxRange / 255.0 / value.a));
}

vec4 linearToRGBD(vec3 value, float maxRange) {
  float maxRGB = max(value.r, max(value.g, value.b));
  float D = max(maxRange / maxRGB, 1.0);
  // NOTE: The implementation with min causes the shader to not compile on
  // a common Alcatel A502DL in Chrome 78/Android 8.1. Some research suggests
  // that the chipset is Mediatek MT6739 w/ IMG PowerVR GE8100 GPU.
  // D = min( floor( D ) / 255., 1. );
  D = clamp(floor(D) / 255.0, 0.0, 1.0);
  return vec4(value.rgb * (D * (255.0 / maxRange)), D);
}
