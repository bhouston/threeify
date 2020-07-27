precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform vec3      albedoModulator;
uniform sampler2D albedoMap;
uniform vec3      specularModulator;
uniform sampler2D specularMap;
uniform float     specularRoughnessModulator;
uniform sampler2D specularRoughnessMap;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>

void main() {

  vec3 albedo = albedoModulator * sRGBToLinear( texture2D( albedoMap, v_uv0 ).rgb );
  vec3 specular = specularModulator * vec3( length( texture2D( specularMap, v_uv0 ).rgb ) );
  float specularRoughness = specularRoughnessModulator * sRGBToLinear( texture2D( specularRoughnessMap, v_uv0 ).rgb ).r;
  vec3 specularF0 = specularIntensityToF0( specular );

  Surface surface;
  surface.position = v_viewSurfacePosition;
  surface.normal = normalize( v_viewSurfaceNormal );
  surface.viewDirection = normalize( -v_viewSurfacePosition );

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.intensity = pointLightIntensity;
  punctualLight.range = pointLightRange;

  DirectLight directLight;
  pointLightToDirectLight( surface, punctualLight, directLight );

  vec3 lightDirection = directLight.lightDirection;
  vec3 lightRadiance = directLight.radiance;

  float normalFluxRatio = saturate( dot( lightDirection, surface.normal ) );

  vec3 outgoingRadiance;
  outgoingRadiance += lightRadiance * normalFluxRatio *
    BRDF_Specular_GGX( surface, lightDirection, specularF0, specularRoughness ) ;
  outgoingRadiance += lightRadiance * normalFluxRatio *
    BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outgoingRadiance );
  gl_FragColor.a = 1.;

}
