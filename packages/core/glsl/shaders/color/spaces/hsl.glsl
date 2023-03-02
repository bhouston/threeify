#pragma once

#pragma import "../../math.glsl"

// glsl function to convert hsl to rgb
// h,s,l ranges are in 0.0 - 1.0
// r,g,b are returned in the set 0.0 - 1.0
// this code was adapted from http://en.wikipedia.org/wiki/HSL_color_space#Converting_to_RGB

float hue2rgb(float p, float q, float t) {
  if (t < 0.0) t += 1.0;
  if (t > 1.0) t -= 1.0;
  if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
  if (t < 1.0 / 2.0) return q;
  if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
  return p;
}

vec3 hsl2rgb(float h, float s, float l) {
  vec3 rgb;
  if (s == 0.0) {
    rgb = vec3(l); // achromatic
  } else {
    float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    float p = 2.0 * l - q;
    rgb.r = hue2rgb(p, q, h + 1.0 / 3.0);
    rgb.g = hue2rgb(p, q, h);
    rgb.b = hue2rgb(p, q, h - 1.0 / 3.0);
  }
  return rgb;
}

// convert from rgb to hsl
// r,g,b are in the set 0.0 - 1.0
// h,s,l are returned in the set 0.0 - 1.0
// this code was adapted from http://en.wikipedia.org/wiki/HSL_color_space#Converting_to_HSL
vec3 rgb2hsl(vec3 rgb) {
  vec3 hsl; // init to 0 to avoid warnings ? (and reverse if + remove first part)

  float fmin = min3(rgb);
  float fmax = max4(rgb);
  float delta = fmax - fmin;

  hsl.z = (fmax + fmin) / 2.0; // Luminance

  if (delta > 0.0) {
    // If chroma is not zero, then compute hue and saturation
    if (hsl.z < 0.5)
      hsl.y = delta / (fmax + fmin); // Saturation
    else hsl.y = delta / (2.0 - fmax - fmin); // Saturation

    float deltaR = ((fmax - rgb.r) / 6.0 + delta / 2.0) / delta;
    float deltaG = ((fmax - rgb.g) / 6.0 + delta / 2.0) / delta;
    float deltaB = ((fmax - rgb.b) / 6.0 + delta / 2.0) / delta;

    if (rgb.r == fmax)
      hsl.x = deltaB - deltaG; // Hue
    else if (rgb.g == fmax)
      hsl.x = 1.0 / 3.0 + deltaR - deltaB; // Hue
    else if (rgb.b == fmax) hsl.x = 2.0 / 3.0 + deltaG - deltaR; // Hue

    if (hsl.x < 0.0) hsl.x += 1.0; // Hue
    if (hsl.x > 1.0) hsl.x -= 1.0; // Hue
  }

  return hsl;
}

// convert from rgb to hsv
// r,g,b are in the set 0.0

