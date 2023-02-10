#pragma once

#pragma include <lighting/punctual>
#pragma include <ibl/ibl>

uniform samplerCube iblMapTexture;
uniform vec3 iblMapIntensity;
uniform int iblMapMaxLod;

uniform int numPunctualLights;

#if MAX_PUNCTUAL_LIGHTS > 0
uniform int punctualLightType[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightWorldPosition[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightWorldDirection[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightIntensity[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightRange[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightInnerCos[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightOuterCos[MAX_PUNCTUAL_LIGHTS];
#endif

#pragma include <math/mat4>

PunctualLight readPunctualLightFromUniforms(int lightIndex, mat4 worldToView) {
  PunctualLight punctualLight;
  #if MAX_PUNCTUAL_LIGHTS > 0
  punctualLight.type = punctualLightType[lightIndex];
  punctualLight.position = mat4TransformPosition(
    worldToView,
    punctualLightWorldPosition[lightIndex]
  );
  punctualLight.direction = mat4TransformDirection(
    worldToView,
    punctualLightWorldDirection[lightIndex]
  );
  punctualLight.intensity = punctualLightIntensity[lightIndex];
  punctualLight.range = punctualLightRange[lightIndex];
  punctualLight.innerConeCos = punctualLightInnerCos[lightIndex];
  punctualLight.outerConeCos = punctualLightOuterCos[lightIndex];
  #endif
  return punctualLight;
}
