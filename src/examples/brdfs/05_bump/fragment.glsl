precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightColor;
uniform float pointLightRange;

uniform sampler2D albedoMap;
uniform sampler2D bumpMap;
uniform sampler2D specularRoughnessMap;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/ambient/basic>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <color/spaces/srgb>

void main() {

  vec3 albedo = sRGBToLinear( texture2D( albedoMap, v_uv0 * 0.5 ).rgb );
  vec3 specular = vec3(1.0);
  float specularRoughness = texture2D( specularRoughnessMap, v_uv0 * 0.5 ).r;

  Surface surface;
  surface.position = v_viewSurfacePosition;
  surface.normal = normalize( v_viewSurfaceNormal );
  surface.viewDirection = normalize( -v_viewSurfacePosition );

  uvToTangentFrame( surface, v_uv0 * 0.5 );
	perturbSurfaceNormal_BumpMap( surface, bumpMap, v_uv0 * 0.5, 4.0 );

  PunctualLight punctualLight;
  punctualLight.position = pointLightViewPosition;
  punctualLight.color = pointLightColor;
  punctualLight.range = pointLightRange;

  DirectIllumination directIllumination;
  pointLightToDirectIllumination( surface, punctualLight, directIllumination );

  vec3 outputColor = vec3(0.0);
  outputColor += BRDF_Diffuse_Lambert( directIllumination, surface, albedo );
  outputColor += BRDF_Specular_GGX( directIllumination, surface, specular, specularRoughness );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  gl_FragColor.a = 1.0;

}
