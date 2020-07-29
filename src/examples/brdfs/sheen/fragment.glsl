precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform vec3 sheenColor;
uniform float sheenIntensity;
uniform float sheenRoughness;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <brdfs/sheen/charlie>
#pragma include <color/spaces/srgb>
#pragma include <normals/tangentSpace>

void main() {

  vec3 albedo = vec3( 0., 0., 1. );
  vec3 specular = vec3(0.15);
  float specularRoughness = 0.5;
  vec3 specularF0 = specularIntensityToF0( specular );

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize( v_viewSurfaceNormal );
  vec3 viewDirection = normalize( -v_viewSurfacePosition );

  mat3 tangentToView = tangentToViewFromPositionNormalUV( position, normal, v_uv0 );
  normal = tangentToView[2];

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.intensity = pointLightIntensity;
  punctualLight.range = pointLightRange;

  DirectLight directLight;
  pointLightToDirectLight( position, punctualLight, directLight );

  float dotNL = saturate( dot( directLight.direction, normal ) );

  vec3 outgoingRadiance;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Sheen_Charlie( normal, viewDirection, directLight.direction, sheenColor, sheenIntensity, sheenRoughness ) ;
  outgoingRadiance +=  (1. - sheenIntensity ) * directLight.radiance * dotNL *
    BRDF_Specular_GGX( normal, viewDirection, directLight.direction, specularF0, specularRoughness ) ;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outgoingRadiance );
  gl_FragColor.a = 1.;

}
