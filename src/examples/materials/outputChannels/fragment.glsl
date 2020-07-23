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
uniform int time;
#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>
#pragma include <normals/normalPacking>
#pragma include <materials/outputChannels>

void main() {

  OutputChannels outputChannels;

  outputChannels.alpha = 1.0;
  vec3 albedo = outputChannels.albedo = mix( vec3(0.2), vec3( 1., 0., 0. ), normalScale.y );
  vec3 specular = vec3(1.);
  float specularRoughness = 0.25;
  vec3 specularF0 = specularIntensityToF0( specular );
  vec3 normal = normalize( rgbToNormal( texture2D( normalMap, vec2(1.0)-v_uv0 ).rgb ) * vec3( normalScale, 1. ) );
  outputChannels.metalness = 0.0;
  outputChannels.roughness = specularRoughness;

  Surface surface;
  surface.position = v_viewSurfacePosition;
  surface.normal = normalize( v_viewSurfaceNormal );
  surface.viewDirection = normalize( -v_viewSurfacePosition );

  uvToTangentFrame( surface, v_uv0 );
  perturbSurfaceNormal_TangentSpace( surface, normal );

  outputChannels.normal = surface.normal;
  outputChannels.clipDepth = -surface.position.z / 4.0;

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
  outputColor += outputChannels.specular = irradiance * BRDF_Specular_GGX( surface, lightDirection, specularF0, specularRoughness );
  outputColor += outputChannels.diffuse = irradiance * BRDF_Diffuse_Lambert( albedo );

  outputChannels.beauty = linearTosRGB( outputColor );

  int newFragmentOutputs = int( mod(( -gl_FragCoord.x * 3. + gl_FragCoord.y ) * 0.002 + float( time ) / 3000., 13. ) );

  writeOutputChannels( outputChannels, newFragmentOutputs );

}
