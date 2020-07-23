attribute vec3 position;
attribute vec3 normal;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec3 v_localNormal;

void main() {

  v_localNormal = normalize( position );
  v_viewNormal = normalize( ( worldToView * localToWorld * vec4( normalize( position ), 0. ) ).xyz );
  v_viewPosition = ( worldToView * localToWorld * vec4( position, 1. ) ).xyz;
  gl_Position = viewToScreen * vec4( v_viewPosition, 1. );

}
