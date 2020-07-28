precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform float     specularAnisotropicScale;
uniform sampler2D specularAnisotropicFlowMap;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <brdfs/specular/anisotropy>
#pragma include <color/spaces/srgb>

void main() {

  vec3 albedo = vec3( 1. );
  vec3 specular = vec3( 1. );
  float specularRoughness = 0.25;
  vec2 specularAnisotropicFlow = specularAnisotropicScale * decodeDirection( texture2D( specularAnisotropicFlowMap, v_uv0 ).rg );
  vec3 specularF0 = specularIntensityToF0( specular );

  Surface surface;
  surface.position = v_viewSurfacePosition;
  surface.normal = normalize( v_viewSurfaceNormal );
  surface.viewDirection = normalize( -v_viewSurfacePosition );

  uvToTangentFrame( surface, v_uv0 );
  rotateTangentFrame( surface, normalize( specularAnisotropicFlow ) );

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.intensity = pointLightIntensity;
  punctualLight.range = pointLightRange;

  specularAnisotropicBentNormal( surface, length( specularAnisotropicFlow ), specularRoughness );

  DirectLight directLight;
  pointLightToDirectLight( surface, punctualLight, directLight );

  float dotNL = saturate( dot( directLight.direction, surface.normal ) );

  vec3 outgoingRadiance;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Specular_GGX( surface, directLight.direction, specularF0, specularRoughness ) ;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outgoingRadiance );
  gl_FragColor.a = 1.;

}
