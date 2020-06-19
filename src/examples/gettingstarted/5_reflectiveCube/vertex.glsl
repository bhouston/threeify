attribute vec3 position;
attribute vec3 normal;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

void main() {

  v_viewNormal = normalize( ( worldToView * localToWorld * vec4( normal, 0.0 ) ).xyz );
  v_viewPosition = ( worldToView * localToWorld * vec4( position, 1.0 ) ).xyz;
  gl_Position = viewToScreen * vec4( v_viewPosition, 1.0 );

}
