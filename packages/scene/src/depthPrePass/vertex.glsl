in vec3 position;
in vec3 normal;
in vec2 uv0;
in vec2 uv1;
in vec2 uv2;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToClip;

out vec3 v_viewSurfacePosition;
out vec3 v_viewSurfaceNormal;
out vec2 v_uv0;
out vec2 v_uv1;
out vec2 v_uv2;

#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  mat4 localToView = worldToView * localToWorld;
  v_viewSurfaceNormal = mat4TransformNormal3(localToView, normalize(normal));
  v_viewSurfacePosition = mat4TransformPosition3(localToView, position);
  v_uv0 = uv0;
  v_uv1 = uv1;
  v_uv1 = uv2;

  gl_Position = viewToClip * vec4(v_viewSurfacePosition, 1.0);

}
