#pragma once

#pragma include "debugOutputs"

#include <microgeometry/normalPacking>

vec4 debugOutput(int debugOutputIndex, PhysicalMaterial material) {
    DEBUG_OUTPUT(1, material.alphaMode, 3);
    DEBUG_OUTPUT(2, material.alpha);
    DEBUG_OUTPUT(3, material.albedo.xyz);
    DEBUG_OUTPUT(4, material.specularRoughness);
    DEBUG_OUTPUT(5, material.metallic);
    DEBUG_OUTPUT(6, material.emissive / 3.0);
    DEBUG_OUTPUT(7, normalToRgb(material.normal));
    DEBUG_OUTPUT(8, material.specularColor);
    DEBUG_OUTPUT(9, material.specularFactor);
    DEBUG_OUTPUT(10, material.ior / 3.0);
    DEBUG_OUTPUT(11, material.clearcoatFactor);
    DEBUG_OUTPUT(12, material.clearcoatRoughness);
    DEBUG_OUTPUT(13, material.clearcoatTint);
    DEBUG_OUTPUT(14, normalToRgb(material.clearcoatNormal));
    DEBUG_OUTPUT(15, material.sheenColor);
    DEBUG_OUTPUT(16, material.sheenRoughness);
    DEBUG_OUTPUT(17, material.anisotropic);
    DEBUG_OUTPUT(18, material.anisotropicDirection);
    DEBUG_OUTPUT(19, material.transmission);
    DEBUG_OUTPUT(20, material.thickness / 5.0);
    DEBUG_OUTPUT(21, material.attenuationDistance / 5.0);
    DEBUG_OUTPUT(22, material.attenuationColor);
    DEBUG_OUTPUT(23, material.iridescence);
    DEBUG_OUTPUT(24, material.iridescenceIor);
    DEBUG_OUTPUT(25, material.iridescenceThickness);
}
