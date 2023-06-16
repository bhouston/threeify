precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 directionalLightViewDirection;
uniform vec3 directionalLightColor;

uniform sampler2D albedoMap;

out vec4 outputColor;

#pragma import "@threeify/core/src/shaders/lighting/punctual.glsl"
#pragma import "@threeify/core/src/shaders/brdfs/ambient/basic.glsl"
#pragma import "@threeify/core/src/shaders/brdfs/diffuse/lambert.glsl"
#pragma import "@threeify/core/src/shaders/brdfs/specular/ggx.glsl"
#pragma import "@threeify/core/src/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/src/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/src/shaders/microgeometry/tangentSpace.glsl"

void main() {
  vec3 albedo = sRGBToLinear(texture(albedoMap, v_uv0).rgb);
  vec3 specular = vec3(0.25);
  float specularRoughness = 0.5;
  vec3 specularF0 = specularIntensityToF0(specular);
  vec3 specularF90 = vec3(1.0);

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    position,
    normal,
    v_uv0
  );
  normal = tangentToView[2];

  PunctualLight punctualLight;
  punctualLight.direction = directionalLightViewDirection;
  punctualLight.intensity = directionalLightColor;

  DirectLight directLight;
  directionalLightToDirectLight(punctualLight, directLight);

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
