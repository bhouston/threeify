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

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>
#pragma include <normals/normalPacking>

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
  punctualLight.position = spotLightViewPosition;
  punctualLight.direction = spotLightViewDirection;
  punctualLight.intensity = spotLightColor;
  punctualLight.range = spotLightRange;
  punctualLight.innerConeCos = spotLightInnerCos;
  punctualLight.outerConeCos = spotLightOuterCos;

  DirectLight directLight;
  spotLightToDirectLight( surface, punctualLight, directLight );

  float dotNL = saturate( dot( directLight.direction, surface.normal ) );

  vec3 outgoingRadiance;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Specular_GGX( surface, directLight.direction, specularF0, specularRoughness ) ;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outgoingRadiance );
  gl_FragColor.a = 1.;

}
