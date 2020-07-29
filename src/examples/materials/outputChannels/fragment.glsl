precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
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

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize( v_viewSurfaceNormal );
  vec3 viewDirection = normalize( -v_viewSurfacePosition );

  mat3 tangentToView = tangentToViewFromPositionUV( surface.position, surface.normal, v_uv0 );
  tangentToView *= mat3( vec3( 1., 0., 0. ), vec3( 0., 1., 0. ), normal );

  outputChannels.normal = surface.normal;
  outputChannels.clipDepth = -surface.position.z / 4.0;

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.intensity = pointLightIntensity;
  punctualLight.range = pointLightRange;

  DirectLight directLight;
  pointLightToDirectLight( surface, punctualLight, directLight );

  float dotNL = saturate( dot( directLight.direction, surface.normal ) );

  vec3 outputDiffuse;
  vec3 outputSpecular;
  vec3 outputRadiance;
  outputRadiance += outputChannels.specular = directLight.radiance * dotNL *
    BRDF_Specular_GGX( normal, viewDirection, directLight.direction, specularF0, specularRoughness );
  outputRadiance += outputChannels.diffuse = directLight.radiance * dotNL *
    BRDF_Diffuse_Lambert( albedo );

  outputChannels.beauty = linearTosRGB( outputRadiance );

  int newFragmentOutputs = int( mod(( -gl_FragCoord.x * 3. + gl_FragCoord.y ) * 0.002 + float( time ) / 3000., 13. ) );

  writeOutputChannels( outputChannels, newFragmentOutputs );

}
