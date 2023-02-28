precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform vec3 sheenColor;
uniform float sheenRoughness;

out vec4 outputColor;

#pragma import "@threeify/core/shaders/lighting/punctual.glsl"
#pragma import "@threeify/core/shaders/brdfs/ambient/basic.glsl"
#pragma import "@threeify/core/shaders/brdfs/diffuse/lambert.glsl"
#pragma import "@threeify/core/shaders/brdfs/specular/ggx.glsl"
#pragma import "@threeify/core/shaders/brdfs/sheen/charlie.glsl"
#pragma import "@threeify/core/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/shaders/microgeometry/tangentSpace.glsl"

void main() {
  vec3 albedo = vec3(0.0, 0.0, 1.0);
  vec3 specular = vec3(0.15);
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
    BRDF_Sheen_Charlie(
      normal,
      viewDirection,
      directLight.direction,
      sheenColor,
      sheenRoughness
    );
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
