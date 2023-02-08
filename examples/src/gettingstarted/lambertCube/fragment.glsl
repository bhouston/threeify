precision highp float;

in vec3 v_viewPosition;
in vec3 v_viewNormal;
in vec2 v_uv;

uniform sampler2D map;
uniform vec3 viewLightPosition;

out vec4 outputColor;

void main() {
  vec3 albedo = texture(map, v_uv).xyz;
  vec3 directionToLight = normalize(viewLightPosition - v_viewPosition);
  float lambertianIntensity = dot(directionToLight, v_viewNormal);

  outputColor = vec4(albedo * lambertianIntensity, 1.);

}
