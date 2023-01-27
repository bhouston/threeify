precision highp float;

#define NUM_UV_CHANNELS 1

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

#define MAX_PUNCTUAL_LIGHTS (4)
uniform int numPunctualLights;
uniform int punctualLightType[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightWorldPosition[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightWorldDirection[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightColor[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightRange[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightInnerCos[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightOuterCos[MAX_PUNCTUAL_LIGHTS];

uniform vec3 albedo;
uniform sampler2D albedoTexture;
uniform float roughness;

uniform mat4 worldToView;

out vec4 outputColor;

#pragma include <lighting/punctual>
#pragma include <brdfs/diffuse/lambert>
#pragma include <color/spaces/srgb>
#pragma include <math/mat4>
#pragma include <brdfs/specular/ggx>


void main() {
  vec3 albedoColor = albedo * sRGBToLinear(texture(albedoTexture, v_uv0).rgb);

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  vec3 outgoingRadiance;

  for (int i = 0; i < numPunctualLights; i++) {
    PunctualLight punctualLight;
    punctualLight.type = punctualLightType[i];
    punctualLight.position = mat4TransformPosition(
      worldToView,
      punctualLightWorldPosition[i]
    );
    punctualLight.direction = mat4TransformDirection(
      worldToView,
      punctualLightWorldDirection[i]
    );
    punctualLight.intensity = punctualLightColor[i];
    punctualLight.range = punctualLightRange[i];
    punctualLight.innerConeCos = punctualLightInnerCos[i];
    punctualLight.outerConeCos = punctualLightOuterCos[i];

    DirectLight directLight = punctualLightToDirectLight(
      position,
      punctualLight
    );

    float dotNL = saturate(dot(directLight.direction, normal));

    outgoingRadiance +=
      directLight.radiance *
      dotNL *
      BRDF_Specular_GGX(
        normal,
        viewDirection,
        directLight.direction,
        vec3(0.04),
        vec3(1.),
        roughness
      );
    outgoingRadiance +=
      directLight.radiance * dotNL * BRDF_Diffuse_Lambert(albedoColor);

  }

  outputColor.rgb = linearTosRGB(outgoingRadiance);
  outputColor.a = 1.0;

}
