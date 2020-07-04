attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

#pragma include <math/matrix4>

void main() {

  mat4 localToView = worldToView * localToWorld;
  v_viewSurfaceNormal = transformDirection( localToView, normalize( position ) );
  v_viewSurfacePosition = transformPosition( localToView, position );
  v_uv0 = uv * 0.5;

  gl_Position = viewToScreen * vec4( v_viewSurfacePosition, 1. );

}
