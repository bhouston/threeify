precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightColor;
uniform float pointLightRange;

uniform vec3 albedoModulator;
uniform sampler2D albedoMap;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/diffuse/lambert>
#pragma include <color/spaces/srgb>

void main() {

  vec3 ambient = vec3(0.0);
  vec3 albedo = albedoModulator * sRGBToLinear( texture2D( albedoMap, v_uv0 ).rgb );

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

  vec3 lightDirection = directIllumination.lightDirection;
  vec3 irradiance = directIllumination.color * saturate( dot( surface.normal, lightDirection ) );

  vec3 outputColor = vec3(0.0);
  outputColor += ( irradiance + ambient ) * BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  gl_FragColor.a = 1.0;

}
