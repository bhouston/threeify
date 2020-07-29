attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

uniform sampler2D displacementMap;
uniform float displacementScale;

varying vec3 v_viewSurfacePosition;
varying vec3 v_viewSurfaceNormal;
varying vec2 v_uv0;

#pragma include <math/mat4>
#pragma include <vertex/displacement>

void main() {

  mat4 localToView = worldToView * localToWorld;
  v_viewSurfaceNormal = mat4TransformDirection( localToView, normal );
  v_viewSurfacePosition = mat4TransformPosition( localToView, position );
  v_uv0 = uv;

  float displacementAmount = texture2D( displacementMap, vec2(1.0)- uv ).x * displacementScale;
  v_viewSurfacePosition = displacePosition( v_viewSurfacePosition, v_viewSurfaceNormal, displacementAmount );

  gl_Position = viewToScreen * vec4( v_viewSurfacePosition, 1. );

}
