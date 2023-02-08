#pragma once

//
// Fresnel
//
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// https://github.com/wdas/brdf/tree/master/src/brdfs
// https://google.github.io/filament/Filament.md.html
//

vec3 F_CookTorrance(vec3 f0, vec3 f90, float VdotH) {
  vec3 f0_sqrt = sqrt(f0);
  vec3 ior = (1. + f0_sqrt) / (1. - f0_sqrt);
  vec3 c = vec3(VdotH);
  vec3 g = sqrt(sq(ior) + c * c - 1.);
  return 0.5 *
  pow(g - c, vec3(2.)) /
  pow(g + c, vec3(2.)) *
  (1. + pow(c * (g + c) - 1., vec3(2.)) / pow(c * (g - c) + 1., vec3(2.)));
}
