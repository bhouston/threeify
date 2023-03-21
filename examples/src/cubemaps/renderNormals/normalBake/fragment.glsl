precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_cubeSurfaceNormal;

uniform vec3 normalScale;
uniform vec3 debugColor;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  vec3 cubeSurfaceNormal = normalize(v_cubeSurfaceNormal) * normalScale;

  outputColor.rgb = normalToColor(cubeSurfaceNormal);
  if (length(debugColor) > 0.0) {
    outputColor.rgb = debugColor;
  }
  outputColor.a = 1.0;
}
