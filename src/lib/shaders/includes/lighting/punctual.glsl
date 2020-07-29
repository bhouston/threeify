// Source:
// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/src/shaders/punctual.glsl
#pragma once
#pragma include <math/math>

// lights
// KHR_lights_punctual extension.
// see https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
struct PunctualLight
{
    int type;
    vec3 position;
    vec3 intensity;
    vec3 direction;
    float range;
    float innerConeCos;
    float outerConeCos;
};

const int LightType_Directional = 0;
const int LightType_Point = 1;
const int LightType_Spot = 2;


// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md#range-property
float getRangeAttenuation( float distanceToLightSource, float maxRange ) {
    if (maxRange <= 0.) {
        // negative range means unlimited
        return 1.;
    }
    return max(min(1. - pow(distanceToLightSource / maxRange, 4.), 1.), 0.) / pow(distanceToLightSource, 2.);
}

// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md#inner-and-outer-cone-angles
float getSpotAttenuation( vec3 pointToLight, PunctualLight punctualLight ) {
    float actualCos = dot( punctualLight.direction, -pointToLight );
    if( actualCos > punctualLight.outerConeCos ) {
        if( actualCos < punctualLight.innerConeCos ) {
            return smoothstep( punctualLight.outerConeCos, punctualLight.innerConeCos, actualCos );
        }
        return 1.;
    }
    return 0.;
}

void pointLightToDirectLight( in vec3 position, in PunctualLight punctualLight, out DirectLight directLight ) {

  vec3 surfaceToLight = punctualLight.position - position;
  float lightAttenuation = getRangeAttenuation( length( surfaceToLight ), punctualLight.range );
  vec3 lightDirection = normalize( surfaceToLight );

  directLight.direction = lightDirection;
  directLight.radiance = punctualLight.intensity * lightAttenuation;
}

void spotLightToDirectLight( in vec3 position, in PunctualLight punctualLight, out DirectLight directLight ) {

  vec3 surfaceToLight = punctualLight.position - position;
  vec3 lightDirection = normalize( surfaceToLight );
  float lightAttenuation = getRangeAttenuation( length( surfaceToLight ), punctualLight.range );
  lightAttenuation *= getSpotAttenuation( lightDirection, punctualLight );

  directLight.direction = lightDirection;
  directLight.radiance = punctualLight.intensity * lightAttenuation;
}

void directionalLightToDirectLight( in PunctualLight punctualLight, out DirectLight directLight ) {

  directLight.direction = -punctualLight.direction;
	directLight.radiance = punctualLight.intensity;
}
