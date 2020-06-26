precision highp float;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

uniform vec3 pointLightViewPosition;
uniform vec3 pointLightColor;
uniform float pointLightRange;

uniform vec3 albedoModulator;
uniform sampler2D albedoMap;

#pragma include <brdfs/diffuse/lambert.glsl>
#pragma include <lighting/punctual.glsl>

void main() {

  vec3 albedo = albedoModulator * texture2D( albedoMap, v_uv0 ).rgb;

  vec3 surfaceToLight = pointLightViewPosition - v_viewSurfacePosition;
  vec3 lightDir = normalize( surfaceToLight );
  float lightAttennuation = getRangeAttenuation( length( surfaceToLight ), pointLightRange );
  float lightDotNormal = clamp( dot( lightDir, v_viewSurfaceNormal ), 0.0, 1.0 );

  gl_FragColor.rgb = lightDotNormal * lightAttennuation * pointLightColor * BRDF_Diffuse_Lambert( albedo );
  gl_FragColor.rgb = pow( gl_FragColor.rgb, vec3( 0.5 ) );
  gl_FragColor.a = 1.0;

}
