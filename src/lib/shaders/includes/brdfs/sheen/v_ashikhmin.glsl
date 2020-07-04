#pragma once

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs#L136
// https://github.com/google/filament/blob/master/libs/ibl/src/CubemapIBL.cpp#L179
// Note: Google call it V_Ashikhmin and V_Neubelt
float V_Ashikhmin(float dotNL, float dotNV) {
    return saturate(1. / (4. * (dotNL + dotNV - dotNL * dotNV)));
}
