in vec3 position;
in vec3 normal;
in vec2 uv0;

uniform mat4 localToCube;
uniform mat4 cubeToLocal;
uniform mat4 cubeToView;
uniform mat4 viewToClip;

out vec3 v_viewSurfacePosition;
out vec3 v_cubeSurfaceNormal;
out vec2 v_uv0;

#pragma import "../../../shaders/math/mat4.glsl"

void main() {
  mat4 localToView = cubeToView * localToCube;
  v_cubeSurfaceNormal = normalize(mat4TransformDirection(cubeToLocal, normal));
  v_viewSurfacePosition = mat4TransformPosition(localToView, position);
  v_uv0 = uv0;

  gl_Position = viewToClip * vec4(v_viewSurfacePosition, 1.0);
}
