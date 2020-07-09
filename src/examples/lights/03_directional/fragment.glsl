precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightViewDirection;
uniform vec3 pointLightColor;
uniform float pointLightRange;
uniform float pointLightInnerCos;
uniform float pointLightOuterCos;

uniform sampler2D albedoMap;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>
#pragma include <normals/packing>

void main() {

  vec3 albedo = sRGBToLinear( texture2D(albedoMap, v_uv0).rgb );
  vec3 specular = vec3(.5);
  float specularRoughness = .25;
  vec3 specularF0 = specularIntensityToF0( specular );

  Surface surface;
  surface.position = v_viewSurfacePosition;
  surface.normal = normalize( v_viewSurfaceNormal );
  surface.viewDirection = normalize( -v_viewSurfacePosition );

  uvToTangentFrame( surface, v_uv0 );

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.direction = pointLightViewDirection;
  punctualLight.color = pointLightColor;
  punctualLight.range = pointLightRange;
  punctualLight.innerConeCos = pointLightInnerCos;
  punctualLight.outerConeCos = pointLightOuterCos;

  DirectIrradiance directIrradiance;
  directionalLightToDirectIrradiance( surface, punctualLight, directIrradiance );

  vec3 lightDirection = directIrradiance.lightDirection;
  vec3 irradiance = directIrradiance.irradiance;

  vec3 outputColor;
  outputColor += irradiance * BRDF_Specular_GGX( surface, lightDirection, specularF0, specularRoughness );
  outputColor += irradiance * BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  gl_FragColor.a = 1.;

}
