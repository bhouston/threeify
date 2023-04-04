precision highp float;

in vec3 v_cubeSurfacePosition;
in vec3 v_cubeSurfaceNormal;

out vec4 outputColor;

#pragma import "../../../shaders/microgeometry/normalPacking.glsl"
#pragma import "../../../shaders/math/mat4.glsl"

void main() {
  vec3 cubeSurfacePosition = v_cubeSurfacePosition;
  vec3 cubeSurfaceNormal = normalize(v_cubeSurfaceNormal);

  outputColor.rgb = normalToColor(cubeSurfaceNormal);
  outputColor.a = clamp(length(cubeSurfacePosition), 0.0, 1.0);
}
