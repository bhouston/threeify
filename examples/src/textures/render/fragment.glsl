precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv;

uniform sampler2D map;
uniform vec3 viewLightPosition;

#pragma include <math/math>

out vec4 outputColor;

void main() {
  vec3 albedo = texture(map, v_uv).xyz;
  vec3 directionToLight = normalize(viewLightPosition - v_viewSurfacePosition);
  float lambertianIntensity = saturate(
    dot(directionToLight, v_viewSurfaceNormal)
  );

  outputColor.rgb = albedo * saturate(lambertianIntensity + 0.5);
  outputColor.a = 1.0;
}
