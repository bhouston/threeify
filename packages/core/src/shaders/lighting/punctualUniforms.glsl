#pragma once

#pragma import "./punctual.glsl"
#pragma import "../ibl/ibl.glsl"

uniform samplerCube iblWorldMap;
uniform vec3 iblIntensity;
uniform int iblMipCount;

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

#pragma import "../math/mat4.glsl"

PunctualLight readPunctualLightFromUniforms(int lightIndex, mat4 worldToView) {
  PunctualLight punctualLight;
  #if MAX_PUNCTUAL_LIGHTS > 0
  punctualLight.type = punctualLightType[lightIndex];
  punctualLight.position = mat4TransformPosition3(
    worldToView,
    punctualLightWorldPosition[lightIndex]
  );
  punctualLight.direction = mat4TransformNormal3(
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
