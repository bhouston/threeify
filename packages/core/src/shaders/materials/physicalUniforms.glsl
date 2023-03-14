#pragma once

#pragma import "../materials/physical.glsl"
#pragma import "../textures/textureAccessors.glsl"

#define EMISSIVE (1)
#define NORMAL (1)
#define OCCLUSION (1)
#define IOR (1)
#define SPECULAR (1)
#define CLEARCOAT (1)
#define SHEEN (1)
#define TRANMISSION (1)
#define VOLUME (1)
#define IRIDESCENCE (1)

uniform int alphaMode;
uniform float alphaCutoff;
uniform float alpha;
uniform vec3 albedoFactor;
uniform TextureAccessor albedoAlphaTextureAccessor;

uniform float specularRoughnessFactor;
uniform float metallicFactor;
uniform TextureAccessor metallicSpecularRoughnessTextureAccessor;

#if defined(EMISSIVE)
uniform vec3 emissiveFactor;
uniform TextureAccessor emissiveTextureAccessor;
#endif

#if defined(NORMAL)
uniform vec2 normalScale;
uniform TextureAccessor normalTextureAccessor;
#endif

#if defined(OCCLUSION)
uniform float occlusionFactor;
uniform TextureAccessor occlusionTextureAccessor;
#endif

#if defined(IOR)
uniform float ior;
#endif

#if defined(SPECULAR)
uniform float specularFactor;
uniform TextureAccessor specularFactorTextureAccessor;
uniform vec3 specularColor;
uniform TextureAccessor specularColorTextureAccessor;
#endif

#if defined(CLEARCOAT)
uniform float clearcoatFactor;
uniform float clearcoatRoughnessFactor;
uniform TextureAccessor clearcoatFactorRoughnessTextureAccessor;
uniform vec2 clearcoatNormalScale;
uniform TextureAccessor clearcoatNormalTextureAccessor;
#endif

#if defined(SHEEN)
uniform vec3 sheenColorFactor;
uniform float sheenRoughnessFactor;
uniform TextureAccessor sheenColorRoughnessTextureAccessor;
#endif

#if defined(TRANMISSION)
uniform float transmissionFactor;
#endif
#if defined(VOLUME)
uniform float thicknessFactor;
uniform vec3 attenuationColor;
uniform float attenuationDistance;
#endif
#if defined(TRANSMISSION) || defined(VOLUME)
uniform TextureAccessor transmissionFactorThicknessTextureAccessor;
#endif

#if defined(IRIDESCENCE)
uniform float iridescenceFactor;
uniform float iridescenceIor;
uniform float iridescenceThicknessMinimum;
uniform float iridescenceThicknessMaximum;
uniform TextureAccessor iridescenceFactorThicknessTextureAccessor;
#endif

#pragma import "../microgeometry/normalPacking.glsl"
#pragma import "../color/spaces/srgb.glsl"
#pragma import "../microgeometry/normalMapping.glsl"

PhysicalMaterial readPhysicalMaterialFromUniforms(
  const vec2 uvs[NUM_UV_CHANNELS]
) {
  PhysicalMaterial material;
  material.alphaMode = alphaMode;
  material.alphaCutoff = alphaCutoff;
  vec4 alebedoAlpha = sampleTexture(albedoAlphaTextureAccessor, uvs);
  material.alpha = alpha * alebedoAlpha.a;
  material.albedo = albedoFactor * sRGBToLinear(alebedoAlpha.rgb);

  vec4 metallicSpecularRoughness = sampleTexture(
    metallicSpecularRoughnessTextureAccessor,
    uvs
  );
  material.specularRoughness =
    max( specularRoughnessFactor * metallicSpecularRoughness.g, 0.03 );
  material.metallic = metallicFactor * metallicSpecularRoughness.b;

  #if defined(EMISSIVE)
  material.emissive =
    emissiveFactor *
    sRGBToLinear(sampleTexture(emissiveTextureAccessor, uvs).rgb);
  #else
  material.emissive = vec3(0.0);
  #endif

  #if defined(NORMAL)
  material.normal =
    vec3(normalScale, 1.0) *
    rgbToNormal(sampleTexture(normalTextureAccessor, uvs).rgb);
  #else
  material.normal = vec3(0.0, 0.0, 1.0);
  #endif

  #if defined(OCCLUSION)
  material.occlusion =
    (sampleTexture(occlusionTextureAccessor, uvs).r - 1.0) * occlusionFactor +
    1.0;
  #else
  material.occlusion = 1.0;
  #endif

  #if defined(IOR)
  // https://github.com/KhronosGroup/glTF/tree/main/extensions/2./Khronos/KHR_materials_ior/README.md
  material.ior = ior;
  #else
  material.ior = 1.5;
  #endif

  #if defined(SPECULAR)
  // https://github.com/KhronosGroup/glTF/tree/main/extensions/2./Khronos/KHR_materials_specular/README.md
  material.specularFactor =
    specularFactor * sampleTexture(specularFactorTextureAccessor, uvs).r;
  material.specularColor =
    specularColor *
    sRGBToLinear(sampleTexture(specularColorTextureAccessor, uvs).rgb);
  #else
  material.specularFactor = 1.0;
  material.specularColor = vec3(1.0);
  #endif

  #if defined(CLEARCOAT)
  // https://github.com/KhronosGroup/glTF/blob/main/extensions/2./Khronos/KHR_materials_clearcoat/README.md
  vec4 clearcoatFactorRoughness = sampleTexture(
    clearcoatFactorRoughnessTextureAccessor,
    uvs
  );
  material.clearcoatFactor = clearcoatFactor * clearcoatFactorRoughness.r;
  material.clearcoatRoughness =
    max( clearcoatRoughnessFactor * clearcoatFactorRoughness.g, 0.03 );
  material.clearcoatNormal =
    vec3(clearcoatNormalScale, 1.0) *
    rgbToNormal(sampleTexture(clearcoatNormalTextureAccessor, uvs).rgb);
  #else
  material.clearcoatFactor = 0.0;
  material.clearcoatRoughness = 0.5;
  material.clearcoatNormal = vec3(0.0, 0.0, 1.0);
  #endif

  #if defined(SHEEN)
  // https://github.com/KhronosGroup/glTF/tree/main/extensions/2./Khronos/KHR_materials_sheen/README.md
  vec4 sheenColorRoughness = sampleTexture(
    sheenColorRoughnessTextureAccessor,
    uvs
  );
  material.sheenColor =
    sheenColorFactor * sRGBToLinear(sheenColorRoughness.rgb);
  material.sheenRoughness = max( sheenRoughnessFactor * sheenColorRoughness.a, 0.03 );
  #else
  material.sheenColor = vec3(0.0);
  material.sheenRoughness = 0.5;
  #endif

  #if defined(TRANSMISSION) || defined(VOLUME)
  vec4 transmissionFactorThickness = sampleTexture(
    transmissionFactorThicknessTextureAccessor,
    uvs
  );
  #endif

  #if defined(TRANMISSION)
  // https://github.com/KhronosGroup/glTF/blob/main/extensions/2./Khronos/KHR_materials_transmission/README.md
  material.transmission = transmissionFactor * transmissionFactorThickness.r;
  #else
  material.transmission = 0.0;
  #endif

  #if defined(VOLUME)
  // https://github.com/KhronosGroup/glTF/blob/main/extensions/2./Khronos/KHR_materials_volume/README.md
  material.thickness = thicknessFactor * transmissionFactorThickness.g;
  material.attenuationColor = attenuationColor;
  material.attenuationDistance = attenuationDistance;
  #else
  material.thickness = 0.0;
  material.attenuationColor = vec3(0.0);
  material.attenuationDistance = 0.0;
  #endif

  #if defined(IRIDESCENCE)
  // https://github.com/KhronosGroup/glTF/tree/main/extensions/2./Khronos/KHR_materials_iridescence/README.md
  vec4 iridescenceFactorThickness = sampleTexture(
    iridescenceFactorThicknessTextureAccessor,
    uvs
  );
  material.iridescence = iridescenceFactor * iridescenceFactorThickness.r;
  material.iridescenceIor = iridescenceIor;
  material.iridescenceThickness = mix(
    iridescenceThicknessMinimum,
    iridescenceThicknessMaximum,
    iridescenceFactorThickness.g
  );
  #else
  material.iridescence = 0.0;
  material.iridescenceIor = 1.5;
  material.iridescenceThickness = 400.0;
  #endif

  return material;
}
