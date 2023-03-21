precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_cubeSurfaceNormal;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {

  outputColor.rgb = normalToColor(v_cubeSurfaceNormal);
  if (length(debugColor) > 0.0) {
    outputColor.rgb = debugColor;
  }
  outputColor.a = 1.0;
}
