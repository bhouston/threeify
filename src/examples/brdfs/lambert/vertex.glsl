in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

out vec3 v_viewSurfacePosition;
out vec3 v_viewSurfaceNormal;
out vec2 v_uv0;

#pragma include <math/mat4>

void main() {
  mat4 localToView = worldToView * localToWorld;
v_viewSurfaceNormal = mat4TransformDirection( localToView, normalize( normal ) );
  v_viewSurfacePosition = mat4TransformPosition(localToView, position);
  v_uv0 = uv;

  gl_Position = viewToScreen * vec4(v_viewSurfacePosition, 1.0);

}
