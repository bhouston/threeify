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
