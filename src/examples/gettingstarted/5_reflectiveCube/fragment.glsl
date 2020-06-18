precision highp float;

uniform sampler2D map;
uniform vec3 viewLightPosition;
uniform samplerCube cubeMap;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

void main() {

  vec3 albedo = texture2D(map, v_uv).xyz;

  vec3 directionToLight = normalize( viewLightPosition - v_viewPosition );
  float lambertianIntensity = dot( directionToLight, v_viewNormal );
  vec3 cubeIntensity = textureCube(cubeMap, normalize(v_viewNormal)).rgb;
  gl_FragColor = vec4( cubeIntensity, 1.0);

}
