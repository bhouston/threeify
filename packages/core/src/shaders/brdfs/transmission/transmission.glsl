#pragma once

// requires this: #pragma import "brdfs/specular/ggx_ibl"

vec3 getVolumeTransmissionRay(
  const vec3 worldNormal,
  const vec3 worldViewDirection,
  const float localThickness,
  const float ior,
  const mat4 localToWorld
) {
  // Compute rotation-independant scaling of the model matrix, The thickness is specified in local space.
  vec3 localToWorldScale = mat4ToScale3(localToWorld);
  vec3 worldThickness = localThickness * localToWorldScale;

  // Direction of refracted light.
  vec3 refractionVector = refract(
    -worldViewDirection,
    normalize(worldNormal),
    1.0 / ior
  );
  return normalize(refractionVector) * worldThickness;
}

// Scale roughness with IOR so that an IOR of 1. results in no microfacet refraction and
// an IOR of 1.5 results in the default amount of microfacet refraction.
float applyIorToRoughness(const float specularRoughness, const float ior) {
  return specularRoughness * clamp(ior * 2.0 - 2.0, 0.0, 1.0);
}

// TODO: use gl_FragCoord instead of fragCoord.
vec4 getTransmissionSample(
  const sampler2D backgroundTexture,
  const vec2 fragCoord,
  const float specularRoughness,
  const float ior
) {
  //return vec4(specularRoughness, specularRoughness, specularRoughness, 1.);
  float backgroundLod =
    log2(float(textureSize(backgroundTexture, 0))) *
    applyIorToRoughness(specularRoughness, ior);
  return textureLod(backgroundTexture, fragCoord, backgroundLod);
}

vec3 getVolumeAttenuation(
  const float distance,
  const vec3 attenuationColor,
  const float attenuationDistance
) {
  // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
  if (isinf(attenuationDistance)) return vec3(1.0);

  // Beer's law https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law

  vec3 attenuationCoefficient = -log(attenuationColor) / attenuationDistance;
  return exp(-attenuationCoefficient * distance);
}

vec4 BTDF_TransmissionAttenuation(
  const vec3 worldNormal,
  const vec3 worldViewDirection,
  const vec3 worldPosition,
  const mat4 localToWorld,
  const mat4 worldToView,
  const mat4 viewToClip,
  const vec3 albedo,
  const vec3 specularF0,
  const vec3 specularF90,
  const float ior,
  const float specularRoughness,
  const float localThickness,
  const vec3 attenuationColor,
  const float attenuationDistance,
  const sampler2D backgroundTexture
) {
  vec3 transmissionRay = getVolumeTransmissionRay(
    worldNormal,
    worldViewDirection,
    localThickness,
    ior,
    localToWorld
  );
  vec3 refractedRayExit = worldPosition + transmissionRay;

  // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
  vec4 clipPosition = viewToClip * worldToView * vec4(refractedRayExit, 1.0);
  vec2 refractionCoords = clipPosition.xy / clipPosition.w;
  refractionCoords += 1.0;
  refractionCoords /= 2.0;

  // Sample framebuffer to get pixel the refracted ray hits.
  vec4 transmittedLight = getTransmissionSample(
    backgroundTexture,
    refractionCoords,
    specularRoughness,
    ior
  );

  vec3 attenuatedColor =
    transmittedLight.xyz *
    getVolumeAttenuation(
      length(transmissionRay),
      attenuationColor,
      attenuationDistance
    );

  // Get the specular component.
  vec3 F = BRDF_Specular_GGX_IBL(
    worldNormal,
    worldViewDirection,
    specularF0,
    specularF90,
    specularRoughness
  );

  return vec4((1.0 - F) * attenuatedColor * albedo, transmittedLight.a);
}
