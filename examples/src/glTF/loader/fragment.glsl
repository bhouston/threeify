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
  float specularRoughness =
    texture(specularRoughnessMap, v_uv0).r * specularRoughnessFactor;

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
