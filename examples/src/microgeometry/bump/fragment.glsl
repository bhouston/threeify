precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform sampler2D albedoMap;
uniform sampler2D bumpMap;
uniform sampler2D specularRoughnessMap;

out vec4 outputColor;

#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>
#pragma include <microgeometry/bumpMapping>
#pragma include <microgeometry/tangentSpace>

void main() {
  vec3 albedo = sRGBToLinear(texture(albedoMap, v_uv0).rgb);
  vec3 specular = vec3(1.0);
  float specularRoughness = texture(specularRoughnessMap, v_uv0).r;
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
  tangentToView[2] = perturbNormalFromBumpMap(
    position,
    tangentToView[2],
    bumpMap,
    v_uv0,
    4.0
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
