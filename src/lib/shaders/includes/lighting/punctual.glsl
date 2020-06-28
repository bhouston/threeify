// Source:
// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/src/shaders/punctual.glsl
#pragma once
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
    if (maxRange <= 0.0)
    {
        // negative range means unlimited
        return 1.0;
    }
    return max(min(1.0 - pow(distanceToLightSource / maxRange, 4.0), 1.0), 0.0) / pow(distanceToLightSource, 2.0);
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
        return 1.0;
    }
    return 0.0;
}

void pointLightToDirectIllumination( in Surface surface, in PunctualLight punctualLight, out DirectIllumination directIllumination ) {

  vec3 surfaceToLight = punctualLight.position - surface.position;
  float lightAttenuation = getRangeAttenuation( length( surfaceToLight ), punctualLight.range );

  directIllumination.color = punctualLight.color * lightAttenuation;
  directIllumination.lightDirection = normalize( surfaceToLight );
}
