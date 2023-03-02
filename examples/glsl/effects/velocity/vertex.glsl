in vec3 position;
in vec3 normal;
in vec2 uv0;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

uniform mat4 previousLocalToWorld;
uniform mat4 previousWorldToView;

out vec3 v_viewSurfacePosition;
out vec3 v_screenSurfacePosition;
out vec3 v_viewSurfaceNormal;

out vec3 v_previousViewSurfacePosition;
out vec3 v_previousScreenSurfacePosition;

out vec2 v_uv0;

#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  mat4 localToView = worldToView * localToWorld;
  v_viewSurfaceNormal = mat4TransformDirection(localToView, normalize(normal));
  v_viewSurfacePosition = mat4TransformPosition(localToView, position);
  v_screenSurfacePosition = mat4TransformPosition(viewToScreen, v_viewSurfacePosition);
  gl_Position = v_screenSurfacePosition;

  mat4 previousLocalToView = previousWworldToView * previouslocalToWorld;
  v_previousViewSurfacePosition = mat4TransformPosition(
    previousLocalToView,
    position
  );
  v_previousScreenPosition = mat4TransformPosition(
    viewToScreen,
    v_previousViewSurfacePosition
  );

  v_uv0 = uv0;
}

