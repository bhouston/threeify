precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 spotLightViewPosition;
uniform vec3 spotLightViewDirection;
uniform vec3 spotLightColor;
uniform float spotLightRange;
uniform float spotLightInnerCos;
uniform float spotLightOuterCos;

uniform sampler2D albedoMap;

out vec4 outputColor;

#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>
#pragma include <microgeometry/normalPacking>
#pragma include <microgeometry/tangentSpace>

void main() {
  vec3 albedo = sRGBToLinear(texture(albedoMap, v_uv0).rgb);
  vec3 specular = vec3(0.5);
  float specularRoughness = 0.25;
  vec3 specularF0 = specularIntensityToF0(specular);
  vec3 specularF90 = vec3(1.);

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    position,
    normal,
    v_uv0
  );

  PunctualLight punctualLight;
  punctualLight.position = spotLightViewPosition;
  punctualLight.direction = spotLightViewDirection;
  punctualLight.intensity = spotLightColor;
  punctualLight.range = spotLightRange;
  punctualLight.innerConeCos = spotLightInnerCos;
  punctualLight.outerConeCos = spotLightOuterCos;

  DirectLight directLight;
  spotLightToDirectLight(position, punctualLight, directLight);

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
  outputColor.a = 1.;

}
