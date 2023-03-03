in vec3 position;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

uniform mat4 previousLocalToWorld;
uniform mat4 previousWorldToView;

out vec3 v_viewSurfacePosition;
out vec4 v_screenSurfacePosition;

out vec3 v_previousViewSurfacePosition;
out vec4 v_previousScreenSurfacePosition;

#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  mat4 localToView = worldToView * localToWorld;
  v_viewSurfacePosition = mat4TransformPosition(localToView, position);
 
  v_screenSurfacePosition = viewToScreen * vec4(v_viewSurfacePosition, 1.0);
  gl_Position = v_screenSurfacePosition;

  mat4 previousLocalToView = previousWorldToView * previousLocalToWorld;
  v_previousViewSurfacePosition = mat4TransformPosition(
    previousLocalToView,
    position
  );
   v_previousScreenSurfacePosition = viewToScreen * vec4(v_previousViewSurfacePosition, 1.0);
}
