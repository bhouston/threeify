precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv;

uniform sampler2D map;
uniform vec3 viewLightPosition;

out vec4 outputColor;

#pragma import "@threeify/core/src/shaders/math.glsl"

void main() {
  vec3 albedo = texture(map, v_uv).xxx;
  vec3 directionToLight = normalize(viewLightPosition - v_viewSurfacePosition);
  float lambertianIntensity = saturate(
    dot(directionToLight, v_viewSurfaceNormal)
  );

  outputColor.rgb = albedo * saturate(lambertianIntensity + 0.25);
  outputColor.a = 1.0;

}
