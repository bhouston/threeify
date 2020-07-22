precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightColor;
uniform float pointLightRange;

uniform sampler2D normalMap;
uniform vec2 normalScale;
uniform float displacementScale;
uniform int fragmentOutputs;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>
#pragma include <normals/normalPacking>
#pragma include <materials/writeFragmentOutputs>

void main() {

  vec3 albedo = mix( vec3(0.2), vec3( 1., 0., 0. ), normalScale.y );
  vec3 specular = vec3(1.);
  float specularRoughness = 0.25;
  vec3 specularF0 = specularIntensityToF0( specular );
  vec3 normal = normalize( rgbToNormal( texture2D( normalMap, vec2(1.0)-v_uv0 ).rgb ) * vec3( normalScale, 1. ) );

  Surface surface;
  surface.position = v_viewSurfacePosition;
  surface.normal = normalize( v_viewSurfaceNormal );
  surface.viewDirection = normalize( -v_viewSurfacePosition );

  uvToTangentFrame( surface, v_uv0 );
  perturbSurfaceNormal_TangentSpace( surface, normal );

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.color = pointLightColor;
  punctualLight.range = pointLightRange;

  DirectLight directLight;
  pointLightToDirectLight( surface, punctualLight, directLight );

  vec3 lightDirection = directLight.lightDirection;
  vec3 irradiance = directLight.irradiance;

  vec3 outputDiffuse;
  vec3 outputSpecular;
  vec3 outputColor;
  outputColor += ( outputSpecular = irradiance * BRDF_Specular_GGX( surface, lightDirection, specularF0, specularRoughness ) );
  outputColor += ( outputDiffuse = irradiance * BRDF_Diffuse_Lambert( albedo ) );

  vec3 beauty;
  beauty.rgb = linearTosRGB( outputColor );

  writeFragmentOutputs( fragmentOutputs, -surface.position.z / 5.0, surface.normal, albedo, 0.0, specularRoughness, beauty, outputDiffuse, outputSpecular );

}
