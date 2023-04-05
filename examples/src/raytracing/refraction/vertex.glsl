in vec3 position;
in vec3 normal;
in vec2 uv0;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToClip;


out vec3 v_worldSurfaceNormal;
out vec3 v_viewSurfacePosition;
out vec3 v_viewSurfaceNormal;
out vec2 v_uv0;

#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  v_worldSurfaceNormal = normalize(normal);
  v_viewSurfaceNormal = mat4TransformNormal3(worldToView, normalize(normal)); // IBL normal is in world space
  v_viewSurfacePosition = position * 1.0; // IBL origin of the sphere is in view space
  v_uv0 = uv0;

  gl_Position = viewToClip * vec4(v_viewSurfacePosition, 1.0);

}
