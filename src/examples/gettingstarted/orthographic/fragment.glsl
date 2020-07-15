precision highp float;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

uniform sampler2D map;
uniform vec3 viewLightPosition;

void main() {

  vec3 albedo = texture2D(map, v_uv).xyz;
  vec3 directionToLight = normalize( viewLightPosition - v_viewPosition );
  float lambertianIntensity = dot( directionToLight, v_viewNormal );

  gl_FragColor = vec4( albedo * lambertianIntensity, 1. );

}
