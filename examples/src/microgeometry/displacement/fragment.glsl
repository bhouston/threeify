precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform sampler2D normalMap;
uniform vec2 normalScale;
uniform float displacementScale;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/lighting/punctual.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/ambient/basic.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/diffuse/lambert.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/ggx.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/microgeometry/tangentSpace.glsl"

void main() {
  vec3 albedo = mix(vec3(0.2), vec3(1.0, 0.0, 0.0), normalScale.y);
  vec3 specular = vec3(1.0);
  float specularRoughness = 0.25;
  vec3 specularF0 = specularIntensityToF0(specular);
  vec3 specularF90 = vec3(1.0);

  vec3 normalDelta = normalize(
    rgbToNormal(texture(normalMap, vec2(1.0) - v_uv0).rgb) *
      vec3(normalScale, 1.0)
  );

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    position,
    normal,
    v_uv0
  );
  // warning, non-orthogonal matrix
  tangentToView *= mat3(
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
    normalize(normalDelta)
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
