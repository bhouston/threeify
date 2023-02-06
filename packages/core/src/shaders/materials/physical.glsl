#pragma once

struct PhysicalMaterial {
  int alphaMode;
  float alphaCutoff;

  float alpha;

  vec3 albedo;
  float specularFactor;
  vec3 specularColor;
  float specularRoughness;
  float metallic;

  float occlusion;

  vec3 normal;

  float ior;

  vec3 emissive;

  float clearcoatFactor;
  float clearcoatRoughness;
  vec3 clearcoatTint;
  vec3 clearcoatNormal;

  vec3 sheenColor;
  float sheenRoughness;

  float anisotropic;
  vec2 anisotropicDirection;

  float transmission;
  float thickness;
  float attenuationDistance;
  vec3 attenuationColor;

  float iridescence;
  float iridescenceIor;
  float iridescenceThickness;
};

vec4 toVec4(int value, int maximum) {
  return vec4(vec3(float(value) / float(maximum)), 1.0);
}
vec4 toVec4(float value) {
  return vec4(vec3(value), 1.0);
}
vec4 toVec4(vec2 value) {
  return vec4(value.x, value.y, 0.0, 1.0);
}
vec4 toVec4(vec3 value) {
  return vec4(value, 1.0);
}
vec4 toVec4(vec4 value) {
  return value;
}

#include <microgeometry/normalPacking>

vec4 debugOutput(int debugOutputIndex, PhysicalMaterial material) {
  switch (debugOutputIndex) {
    case 1:
      return toVec4(material.alphaMode, 3);
    case 2:
      return toVec4(material.alpha);
    case 3:
      return toVec4(material.albedo.xyz);
    case 4:
      return toVec4(material.specularRoughness);
    case 5:
      return toVec4(material.metallic);
    case 6:
      return toVec4(material.emissive / 3.0);
    case 7:
      return toVec4(normalToRgb(material.normal));
    case 8:
      return toVec4(material.specularColor);
    case 9:
      return toVec4(material.specularFactor);
    case 10:
      return toVec4(material.ior / 3.0);
    case 11:
      return toVec4(material.clearcoatFactor);
    case 12:
      return toVec4(material.clearcoatRoughness);
    case 13:
      return toVec4(material.clearcoatTint);
    case 14:
      return toVec4(normalToRgb(material.clearcoatNormal));
    case 15:
      return toVec4(material.sheenColor);
    case 16:
      return toVec4(material.sheenRoughness);
    case 17:
      return toVec4(material.anisotropic);
    case 18:
      return toVec4(material.anisotropicDirection);
    case 19:
      return toVec4(material.transmission);
    case 20:
      return toVec4(material.thickness);
    case 21:
      return toVec4(material.attenuationDistance);
    case 22:
      return toVec4(material.attenuationColor);
    case 23:
      return toVec4(material.iridescence);
    case 24:
      return toVec4(material.iridescenceIor);
    case 25:
      return toVec4(material.iridescenceThickness);
  }
  return vec4(0.);
}
