attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

void main() {

  v_viewSurfaceNormal = normalize( ( worldToView * localToWorld * vec4( normalize( position ), 0.0 ) ).xyz );
  v_viewSurfacePosition = ( worldToView * localToWorld * vec4( position, 1.0 ) ).xyz;
  v_uv0 = uv;
  gl_Position = viewToScreen * vec4( v_viewSurfacePosition, 1.0 );

}
