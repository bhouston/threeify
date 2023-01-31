// Source:
// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/src/shaders/punctual.glsl
#pragma once
#pragma include <math>
#pragma include "lighting"

// lights
// KHR_lights_punctual extension.
// see https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
struct PunctualLight {
  int type;
  vec3 intensity;
  vec3 position; // assumed to be in view space
  vec3 direction; // assumed to be in view space
  float range;
  float innerConeCos;
  float outerConeCos;
};

const int LightType_Directional = 0;
const int LightType_Point = 1;
const int LightType_Spot = 2;

// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md#range-property
float getRangeAttenuation(float distanceToLightSource, float maxRange) {
  if (maxRange <= 0.0) {
    // negative range means unlimited
    return 1.0;
  }
  return max(min(1.0 - pow(distanceToLightSource / maxRange, 4.0), 1.0), 0.0) /
  pow(distanceToLightSource, 2.0);
}

// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md#inner-and-outer-cone-angles
float getSpotAttenuation(vec3 pointToLight, PunctualLight punctualLight) {
  float actualCos = dot(punctualLight.direction, -pointToLight);
  if (actualCos > punctualLight.outerConeCos) {
    if (actualCos < punctualLight.innerConeCos) {
      return smoothstep(
        punctualLight.outerConeCos,
        punctualLight.innerConeCos,
        actualCos
      );
    }
    return 1.0;
  }
  return 0.0;
}

void pointLightToDirectLight(
  vec3 position,
  PunctualLight punctualLight,
  out DirectLight directLight
) {
  vec3 surfaceToLight = punctualLight.position - position;
  float lightAttenuation = getRangeAttenuation(
    length(surfaceToLight),
    punctualLight.range
  );
  vec3 lightDirection = normalize(surfaceToLight);

  directLight.direction = lightDirection;
  directLight.radiance = punctualLight.intensity * lightAttenuation;
}

void spotLightToDirectLight(
  vec3 position,
  PunctualLight punctualLight,
  out DirectLight directLight
) {
  vec3 surfaceToLight = punctualLight.position - position;
  vec3 lightDirection = normalize(surfaceToLight);
  float lightAttenuation = getRangeAttenuation(
    length(surfaceToLight),
    punctualLight.range
  );
  lightAttenuation *= getSpotAttenuation(lightDirection, punctualLight);

  directLight.direction = lightDirection;
  directLight.radiance = punctualLight.intensity * lightAttenuation;
}

void directionalLightToDirectLight(
  PunctualLight punctualLight,
  out DirectLight directLight
) {
  directLight.direction = -punctualLight.direction;
  directLight.radiance = punctualLight.intensity;
}

DirectLight punctualLightToDirectLight(
  vec3 position,
  PunctualLight punctualLight
) {
  DirectLight directLight;
  switch (punctualLight.type) {
    case LightType_Point:
      pointLightToDirectLight(position, punctualLight, directLight);
      break;
    case LightType_Spot:
      spotLightToDirectLight(position, punctualLight, directLight);
      break;
    case LightType_Directional:
      directionalLightToDirectLight(punctualLight, directLight);
      break;
  }
  return directLight;
}
