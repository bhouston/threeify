precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 spotLightViewPosition;
uniform vec3 spotLightViewDirection;
uniform vec3 spotLightColor;
uniform float spotLightRange;
uniform float spotLightInnerCos;
uniform float spotLightOuterCos;

uniform sampler2D albedoMap;


#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>
#pragma include <normals/normalPacking>
#pragma include <normals/tangentSpace>

void main() {

  vec3 albedo = sRGBToLinear( texture2D(albedoMap, v_uv0).rgb );
  vec3 specular = vec3(.5);
  float specularRoughness = .25;
  vec3 specularF0 = specularIntensityToF0( specular );

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize( v_viewSurfaceNormal );
  vec3 viewDirection = normalize( -v_viewSurfacePosition );

  mat3 tangentToView = tangentToViewFromPositionNormalUV( position, normal, v_uv0 );

  PunctualLight punctualLight;
  punctualLight.position = spotLightViewPosition;
  punctualLight.direction = spotLightViewDirection;
  punctualLight.intensity = spotLightColor;
  punctualLight.range = spotLightRange;
  punctualLight.innerConeCos = spotLightInnerCos;
  punctualLight.outerConeCos = spotLightOuterCos;

  DirectLight directLight;
  spotLightToDirectLight( position, punctualLight, directLight );

  float dotNL = saturate( dot( directLight.direction, normal ) );

  vec3 outgoingRadiance;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Specular_GGX( normal, viewDirection, directLight.direction, specularF0, specularRoughness ) ;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outgoingRadiance );
  gl_FragColor.a = 1.;

}
