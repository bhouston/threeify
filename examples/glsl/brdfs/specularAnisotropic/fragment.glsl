precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform float specularAnisotropicStrength;
uniform sampler2D specularAnisotropicFlowMap;

out vec4 outputColor;

#pragma import "@threeify/core/shaders/lighting/punctual.glsl"
#pragma import "@threeify/core/shaders/brdfs/diffuse/lambert.glsl"
#pragma import "@threeify/core/shaders/brdfs/specular/ggx_anisotropic.glsl"
#pragma import "@threeify/core/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/shaders/microgeometry/tangentSpace.glsl"
#pragma import "@threeify/core/shaders/math/mat2.glsl"
#pragma import "@threeify/core/shaders/math/mat3.glsl"
#pragma import "@threeify/core/shaders/math/vectorMath.glsl"

void main() {
  vec3 albedo = texture(specularAnisotropicFlowMap, v_uv0).rgb;
  vec3 specular = vec3(0.5);
  float specularRoughness = 0.5;
  vec2 specularAnisotropicFlow = decodeDirection(
    texture(specularAnisotropicFlowMap, v_uv0).rg
  );
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
  vec3 tangent = tangentToView[0];
  vec3 bitangent = tangentToView[1];

  vec3 tempAnisotropicT = transformTangentByFlow(
    specularAnisotropicFlow,
    tangent,
    bitangent
  );
  // reproject tangent/bitangent on the material normal plane
  vec3 anisotropicT = normalize(ortho(tempAnisotropicT, normal));
  vec3 anisotropicB = normalize(cross(normal, anisotropicT));

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
    BRDF_Specular_GGX_Anisotropic(
      normal,
      viewDirection,
      directLight.direction,
      specularF0,
      specularF90,
      specularF90,
      specularRoughness,
      anisotropicT,
      anisotropicB,
      specularAnisotropicStrength
    );
  outgoingRadiance +=
    directLight.radiance * dotNL * BRDF_Diffuse_Lambert(albedo);

  outputColor.rgb = linearTosRGB(outgoingRadiance);
  outputColor.a = 1.0;

}
