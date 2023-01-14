precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform vec3 albedo;
uniform sampler2D albedoTexture;

out vec4 outputColor;

#pragma include <lighting/punctual>
#pragma include <brdfs/diffuse/lambert>
#pragma include <color/spaces/srgb>

void main() {
  vec3 albedoColor = albedo * sRGBToLinear(texture(albedoTexture, v_uv0).rgb);

  PunctualLight punctualLight;
  punctualLight.type = LightType_Point;
  punctualLight.position = pointLightViewPosition;
  punctualLight.intensity = pointLightIntensity;
  punctualLight.direction = vec3(0.0);
  punctualLight.range = pointLightRange;
  punctualLight.innerConeCos = 0.0;
  punctualLight.outerConeCos = 0.0;

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  DirectLight directLight;
  pointLightToDirectLight(position, punctualLight, directLight);

  float dotNL = saturate(dot(directLight.direction, normal));

  vec3 outgoingRadiance;
  outgoingRadiance +=
    directLight.radiance * dotNL * BRDF_Diffuse_Lambert(albedoColor);

  outputColor.rgb = vec3( 1.0, 0.0, 0.5 ); // linearTosRGB(outgoingRadiance);
  outputColor.a = 1.0;

}
