#pragma once

struct PhysicalMaterial {
  int alphaMode;
  float alphaCutoff;

  float alpha;

  vec3 albedo;
  float specularRoughness;
  float metallic;
  vec3 normal;
  vec3 emissive;

//#if defined(SPECULAR)
  float specularFactor;
  vec3 specularColor;
//#endif

//#if defined(OCCLUSION)
  float occlusion;
//#endif

//#if defined(IOR)
  float ior;
//#endif

//#if defined(CLEARCOAT)
  float clearcoatFactor;
  float clearcoatRoughness;
  vec3 clearcoatTint;
  vec3 clearcoatNormal;
//#endif

//#if defined(SHEEN)
  vec3 sheenColor;
  float sheenRoughness;
//#endif

//#if defined(ANISTROPY)
  float anisotropic;
  vec2 anisotropicDirection;
//#endif

//#if defined(TRANSMISSION)
  float transmission;
  float thickness;
  float attenuationDistance;
  vec3 attenuationColor;
//#endif

//#if defined(IRIDESCENCE)
  float iridescence;
  float iridescenceIor;
  float iridescenceThickness;
//#endif

#if defined(GEM)
  vec3 gemSquishFactor;
  float gemBoostFactor;
  int gemMaxBounces;
#endif
};
