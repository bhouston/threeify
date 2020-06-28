precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightColor;
uniform float pointLightRange;

uniform vec3 albedoModulator;
uniform sampler2D albedoMap;
uniform vec3 specularModulator;
uniform sampler2D specularMap;
uniform float specularRoughnessModulator;
uniform sampler2D specularRoughnessMap;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include "test"

void main() {

  vec3 albedo = albedoModulator * texture2D( albedoMap, v_uv0 ).rgb;
  vec3 specular = specularModulator * texture2D( specularMap, v_uv0 ).rgb;
  float specularRoughness = specularRoughnessModulator * texture2D( specularRoughnessMap, v_uv0 ).r;

  PunctualLight punctualLight;
  punctualLight.type = LightType_Point;
  punctualLight.position = pointLightViewPosition;
  punctualLight.color = pointLightColor;
  punctualLight.direction = vec3(0.0);
  punctualLight.range = pointLightRange;
  punctualLight.innerConeCos = 0.0;
  punctualLight.outerConeCos = 0.0;

  Surface surface;
  surface.position = v_viewSurfacePosition;
  surface.normal = v_viewSurfaceNormal;

  DirectIllumination directIllumination;
  pointLightToDirectIllumination( surface, punctualLight, directIllumination );

  vec3 outputColor = vec3(0.0);
  outputColor += BRDF_Diffuse_Lambert( directIllumination, surface, albedo );
  outputColor += BRDF_Specular_GGX( directIllumination, surface, vec3(1.0), specular, specularRoughness );

  vec3 gammaCorrectedOutputColor = pow( outputColor, vec3( 0.5 ) );

  gl_FragColor.rgb = gammaCorrectedOutputColor;
  gl_FragColor.a = 1.0;

}
