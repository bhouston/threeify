precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform vec3 albedoColor;
uniform sampler2D albedoMap;

uniform float specularRoughnessFactor;
uniform sampler2D specularRoughnessMap;

uniform float clearCoatStrength;
uniform vec3 clearCoatTint;
uniform sampler2D clearCoatBumpMap;
uniform float clearCoatRoughnessFactor;
uniform sampler2D clearCoatRoughnessMap;

out vec4 outputColor;

#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>
#pragma include <normals/bumpMapping>
#pragma include <normals/tangentSpace>

void main() {
  vec3 albedo = sRGBToLinear(texture(albedoMap, v_uv0).rgb) * albedoColor;

  vec3 specular = vec3(0.15);
  vec3 specularF0 = specularIntensityToF0(specular);
  vec3 specularF90 = vec3(1.0);
  float specularRoughness =
    texture(specularRoughnessMap, v_uv0).r * specularRoughnessFactor;

  vec3 clearCoatF0 = specularIntensityToF0(clearCoatStrength * 0.16) * clearCoatTint;
  float clearCoatRoughness =
    texture(clearCoatRoughnessMap, v_uv0).r * clearCoatRoughnessFactor;

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    position,
    normal,
    v_uv0
  );
  normal = tangentToView[2];

  vec3 clearCoatNormal = perturbNormalFromBumpMap(
    position,
    normal,
    clearCoatBumpMap,
    v_uv0,
    1.0
  );

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.intensity = pointLightIntensity;
  punctualLight.range = pointLightRange;

  DirectLight directLight;
  pointLightToDirectLight(position, punctualLight, directLight);

  float clearCoatDotNL = saturate(dot(directLight.direction, clearCoatNormal));
  float dotNL = saturate(dot(directLight.direction, normal));

  // this lack energy conservation.
  vec3 outgoingRadiance;
  outgoingRadiance +=
    directLight.radiance *
    clearCoatDotNL *
    BRDF_Specular_GGX(
      clearCoatNormal,
      viewDirection,
      directLight.direction,
      clearCoatF0,
      vec(1.0),
      clearCoatRoughness
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
