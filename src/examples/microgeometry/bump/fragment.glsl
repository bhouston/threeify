precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform sampler2D albedoMap;
uniform sampler2D bumpMap;
uniform sampler2D specularRoughnessMap;


#pragma include <lib/shaders/includes/lighting/punctual>
#pragma include <lib/shaders/includes/brdfs/ambient/basic>
#pragma include <lib/shaders/includes/brdfs/diffuse/lambert>
#pragma include <lib/shaders/includes/brdfs/specular/ggx>
#pragma include <lib/shaders/includes/color/spaces/srgb>
#pragma include <lib/shaders/includes/normals/bumpMapping>
#pragma include <lib/shaders/includes/normals/tangentSpace>

void main() {

  vec3 albedo = sRGBToLinear( texture2D( albedoMap, v_uv0 ).rgb );
  vec3 specular = vec3(1.);
  float specularRoughness = texture2D( specularRoughnessMap, v_uv0 ).r;
  vec3 specularF0 = specularIntensityToF0( specular );

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize( v_viewSurfaceNormal );
  vec3 viewDirection = normalize( -v_viewSurfacePosition );

  mat3 tangentToView = tangentToViewFromPositionNormalUV( position, normal, v_uv0 );
	tangentToView[2] = perturbNormalFromBumpMap( position, tangentToView[2], bumpMap, v_uv0, 4. );
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
    BRDF_Specular_GGX( normal, viewDirection, directLight.direction, specularF0, specularRoughness ) ;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outgoingRadiance );
  gl_FragColor.a = 1.;

}
