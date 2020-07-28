precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightIntensity;
uniform float pointLightRange;

uniform vec3 albedoModulator;
uniform sampler2D albedoMap;

#pragma include <brdfs/common>
#pragma include <lighting/punctual>
#pragma include <brdfs/diffuse/lambert>
#pragma include <color/spaces/srgb>

void main() {

  vec3 albedo = albedoModulator * sRGBToLinear( texture2D( albedoMap, v_uv0 ).rgb );

  PunctualLight punctualLight;
  punctualLight.type = LightType_Point;
  punctualLight.position = pointLightViewPosition;
  punctualLight.intensity = pointLightIntensity;
  punctualLight.direction = vec3(0.);
  punctualLight.range = pointLightRange;
  punctualLight.innerConeCos = 0.;
  punctualLight.outerConeCos = 0.;

  Surface surface;
  surface.position = v_viewSurfacePosition;
  surface.normal = v_viewSurfaceNormal;

  DirectLight directLight;
  pointLightToDirectLight( surface, punctualLight, directLight );

  float dotNL = saturate( dot( directLight.direction, surface.normal ) );

  vec3 outgoingRadiance;
  outgoingRadiance += directLight.radiance * dotNL *
    BRDF_Diffuse_Lambert( albedo );

  gl_FragColor.rgb = linearTosRGB( outgoingRadiance );
  gl_FragColor.a = 1.;

}
