attribute vec3 position;
attribute vec3 normal;

varying vec3 v_viewNormal;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

void main() {

  v_viewNormal = normalize( ( worldToView * localToWorld * vec4( normal, 0.0 ) ).xyz );
  vec3 position = ( worldToView * localToWorld * vec4( position, 1.0 ) ).xyz;
  gl_Position = viewToScreen * vec4( position, 1.0 );

}
