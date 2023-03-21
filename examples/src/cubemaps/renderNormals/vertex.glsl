in vec3 position;
in vec3 normal;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToClip;

out vec3 v_viewSurfacePosition;
out vec3 v_viewSurfaceNormal;

#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  mat4 localToView = worldToView * localToWorld;
  v_viewSurfaceNormal = mat4TransformDirection(localToView, normalize(normal));
  v_viewSurfacePosition = mat4TransformPosition(localToView, position);

  gl_Position = viewToClip * vec4(v_viewSurfacePosition, 1.0);

}