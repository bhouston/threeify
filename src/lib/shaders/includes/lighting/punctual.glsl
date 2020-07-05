// Source:
// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/src/shaders/punctual.glsl
#pragma once
#pragma include <math/math>
#pragma include <brdfs/common>

// lights
// KHR_lights_punctual extension.
// see https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
struct PunctualLight
{
    int type;
    vec3 position;
    vec3 color;
    vec3 direction;
    float range;
    float innerConeCos;
    float outerConeCos;
};

const int LightType_Directional = 0;
const int LightType_Point = 1;
const int LightType_Spot = 2;


// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md#range-property
float getRangeAttenuation(float distanceToLightSource, float maxRange)
{
    if (maxRange <= 0.)
    {
        // negative range means unlimited
        return 1.;
    }
    return max(min(1. - pow(distanceToLightSource / maxRange, 4.), 1.), 0.) / pow(distanceToLightSource, 2.);
}

// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual/README.md#inner-and-outer-cone-angles
float getSpotAttenuation(vec3 pointToLight, vec3 spotDirection, float outerConeCos, float innerConeCos)
{
    float actualCos = dot(normalize(spotDirection), normalize(-pointToLight));
    if (actualCos > outerConeCos)
    {
        if (actualCos < innerConeCos)
        {
            return smoothstep(outerConeCos, innerConeCos, actualCos);
        }
        return 1.;
    }
    return 0.;
}

void pointLightToDirectIrradiance( in Surface surface, in PunctualLight punctualLight, out DirectIrradiance directIrradiance ) {

  vec3 surfaceToLight = punctualLight.position - surface.position;
  float lightAttenuation = getRangeAttenuation( length( surfaceToLight ), punctualLight.range );
  vec3 lightDirection = normalize( surfaceToLight );

  directIrradiance.lightDirection = lightDirection;
  directIrradiance.irradiance = punctualLight.color * lightAttenuation * saturate( dot( surface.normal, lightDirection ) );
}
