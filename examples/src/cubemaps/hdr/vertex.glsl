in vec3 position;
in vec3 normal;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

out vec3 v_viewPosition;
out vec3 v_viewNormal;

void main() {
  v_viewNormal = normalize(
    (worldToView * localToWorld * vec4(normal, 0.)).xyz
  );
  v_viewPosition = (worldToView * localToWorld * vec4(position, 1.)).xyz;
  gl_Position = viewToScreen * vec4(v_viewPosition, 1.);

}
