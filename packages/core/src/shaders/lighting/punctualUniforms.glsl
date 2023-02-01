#pragma once

#pragma include <lighting/punctual>

uniform samplerCube domeCubeMap;
uniform vec3 domeIntensity;

uniform int numPunctualLights;
uniform int punctualLightType[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightWorldPosition[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightWorldDirection[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightIntensity[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightRange[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightInnerCos[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightOuterCos[MAX_PUNCTUAL_LIGHTS];

#pragma include <math/mat4>

PunctualLight readPunctualLightFromUniforms( in int lightIndex, in mat4 worldToView ) {
    PunctualLight punctualLight;
    punctualLight.type = punctualLightType[lightIndex];
    punctualLight.position = mat4TransformPosition( worldToView, punctualLightWorldPosition[lightIndex] );
    punctualLight.direction = mat4TransformDirection( worldToView, punctualLightWorldDirection[lightIndex] );
    punctualLight.intensity = punctualLightIntensity[lightIndex];
    punctualLight.range = punctualLightRange[lightIndex];
    punctualLight.innerConeCos = punctualLightInnerCos[lightIndex];
    punctualLight.outerConeCos = punctualLightOuterCos[lightIndex];
    return punctualLight;
}
