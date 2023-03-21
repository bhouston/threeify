precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_cubeSurfaceNormal;

out vec4 outputColor;

#pragma import "../../../shaders/microgeometry/normalPacking.glsl"
#pragma import "../../../shaders/math/mat4.glsl"

void main() {
  vec3 cubeSurfaceNormal = normalize(v_cubeSurfaceNormal);

  outputColor.rgb = normalToColor(cubeSurfaceNormal);
  if (length(debugColor) > 0.0) {
    outputColor.rgb = debugColor;
  }
  outputColor.a = 1.0;
}
