precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform vec3 albedoModulator;
uniform sampler2D albedoMap;
uniform vec3 specularModulator;
uniform sampler2D specularMap;
uniform float specularRoughnessModulator;
uniform sampler2D specularRoughnessMap;

out vec4 outputColor;

#pragma import "@threeify/core/src/shaders/lighting/punctual.glsl"
#pragma import "@threeify/core/src/shaders/brdfs/diffuse/lambert.glsl"
#pragma import "@threeify/core/src/shaders/brdfs/specular/ggx.glsl"
#pragma import "@threeify/core/src/shaders/color/spaces/srgb.glsl"

void main() {
  vec3 albedo = albedoModulator * sRGBToLinear(texture(albedoMap, v_uv0).rgb);
  vec3 specular =
    specularModulator * vec3(length(texture(specularMap, v_uv0).rgb));
  float specularRoughness =
    specularRoughnessModulator *
    sRGBToLinear(texture(specularRoughnessMap, v_uv0).rgb).r;
  vec3 specularF0 = specularIntensityToF0(specular);
  vec3 specularF90 = vec3(1.0);

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.intensity = pointLightIntensity;
  punctualLight.range = pointLightRange;

  DirectLight directLight;
  pointLightToDirectLight(position, punctualLight, directLight);

  float dotNL = saturate(dot(directLight.direction, normal));

  vec3 outgoingRadiance;
  outgoingRadiance +=
    directLight.radiance *
    dotNL *
    BRDF_Specular_GGX(
      normal,
      viewDirection,
      directLight.direction,
      specularF0,
      specularF90,
      specularRoughness
    );
  outgoingRadiance +=
    directLight.radiance * dotNL * BRDF_Diffuse_Lambert(albedo);

  outputColor.rgb = linearTosRGB(outgoingRadiance);
  outputColor.a = 1.0;

}
