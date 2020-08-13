attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

void main() {

  v_viewNormal = normalize( ( worldToView * localToWorld * vec4( normal, 0. ) ).xyz );
  v_viewPosition = ( worldToView * localToWorld * vec4( position, 1. ) ).xyz;
  v_uv = uv;

  gl_Position = viewToScreen * vec4( v_viewPosition, 1. );

}
