#pragma once
#include <math/math>

vec3 sheenMix( vec3 sheenColor, vec3 base, const vec3 sheenLayer ) {
    // Sheen energy compensation approximation calculation can be found at the end
    // of https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
    float sheenEnergyComp = 1.0 - 0.157 * max3( sheenColor );

    return base * sheenEnergyComp + sheenLayer;
}