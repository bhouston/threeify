in vec3 position;
in vec3 normal;
in vec2 uv0;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToClip;

uniform sampler2D displacementMap;
uniform float displacementScale;

out vec3 v_viewSurfacePosition;
out vec3 v_viewSurfaceNormal;
out vec2 v_uv0;

#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"
#pragma import "@threeify/core/dist/shaders/microgeometry/displacement.glsl"

void main() {
  mat4 localToView = worldToView * localToWorld;
  v_viewSurfaceNormal = mat4TransformDirection(localToView, normal);
  v_viewSurfacePosition = mat4TransformPosition(localToView, position);
  v_uv0 = uv0;

  float displacementAmount =
    texture(displacementMap, vec2(1.0) - uv0).x * displacementScale;
  v_viewSurfacePosition = displacePosition(
    v_viewSurfacePosition,
    v_viewSurfaceNormal,
    displacementAmount
  );

  gl_Position = viewToClip * vec4(v_viewSurfacePosition, 1.0);

}
