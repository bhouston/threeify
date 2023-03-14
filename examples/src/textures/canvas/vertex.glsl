in vec3 position;
in vec3 normal;
in vec2 uv0;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToClip;

out vec3 v_viewPosition;
out vec3 v_viewNormal;
out vec2 v_uv;

void main() {
  v_viewNormal = normalize(
    (worldToView * localToWorld * vec4(normal, 0.0)).xyz
  );
  v_viewPosition = (worldToView * localToWorld * vec4(position, 1.0)).xyz;
  v_uv = uv0;
  gl_Position = viewToClip * vec4(v_viewPosition, 1.0);

}
