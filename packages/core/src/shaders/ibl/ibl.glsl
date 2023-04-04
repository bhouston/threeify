#pragma once

#pragma import "../math.glsl"
#pragma import "../math/mat4.glsl"
#pragma import "../color/encodings/rgbe.glsl"

/*struct IBLMap {
    samplerCube texture;
    vec3 intensity;
    int maxLod;
};*/

float convertGlossyExponentToSpecularRoughness(const float glossyExponent) {
  return sqrt(2.0 / (glossyExponent + 2.0));
}
float convertSpecularRoughnessToGlossyExponent(const float specularRoughness) {
  return 2.0 / (specularRoughness * specularRoughness) - 2.0;
}

float getMipLevelForSpecularRoughness(
  const float specularRoughness,
  const int iblMipCount
) {
  float glossyExponent = convertSpecularRoughnessToGlossyExponent(
    specularRoughness
  );
  // From McGuire paper on phong cubemap IBL.
  // https://casual-effects.com/research/McGuire2013CubeMap/index.html
  float MIPlevel =
    log2(pow(2.0, float(iblMipCount)) * sqrt(3.0)) -
    0.5 * log2(glossyExponent + 1.0);

  return MIPlevel;
}

vec3 sampleIBLIrradiance(
  const samplerCube iblWorldMap,
  const vec3 iblIntensity,
  const int iblMipCount,
  const vec3 viewNormal,
  const mat4 worldToView
) {
  // convert to world
  vec3 worldNormal = mat4UntransformNormal3(worldToView, viewNormal);
  vec3 iblColor = textureLod(
    iblWorldMap,
    worldNormal,
    float(iblMipCount)
  ).rgb;
  return iblColor * iblIntensity;
}

vec3 sampleIBLRadiance(
  const samplerCube iblWorldMap,
  const vec3 iblIntensity,
  const int iblMipCount,
  const vec3 viewNormal,
  const vec3 viewDirection,
  const mat4 worldToView,
  const float specularRoughness
) {
  vec3 reflectDirection = reflect(-viewDirection, viewNormal);
  // Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
  reflectDirection = normalize(
    mix(reflectDirection, viewNormal, pow2(specularRoughness))
  );

  // convert to world
  vec3 worldReflectDirection = mat4UntransformNormal3(
    worldToView,
    reflectDirection
  );

  // TODO: get the correct level from McGuire paper on phone cubemap IBL.
  float mipLevel = getMipLevelForSpecularRoughness(
    specularRoughness,
    iblMipCount
  );
  vec3 iblColor = textureLod(
    iblWorldMap,
    worldReflectDirection,
    mipLevel
  ).rgb;
  return iblColor * iblIntensity;
}
