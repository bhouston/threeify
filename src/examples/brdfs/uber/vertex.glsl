in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

uniform int featureFlags;
uniform sampler2D displacementMap;
uniform float displacementScale;

out vec3 v_viewSurfacePosition;
out vec3 v_viewSurfaceNormal;
out vec2 v_uv0;

#pragma include <math/mat4>
#pragma include <vertex/displacement>

void main() {

  mat4 localToView = worldToView * localToWorld;
  v_viewSurfaceNormal = mat4TransformDirection( localToView, normalize( position ) );
  v_viewSurfacePosition = mat4TransformPosition( localToView, position );
  v_uv0 = uv;

  if( ( featureFlags & 0x8000 ) != 0 ) {
    float displacementAmount = texture(displacementMap, vec2(1.0) - uv).x * displacementScale;
    v_viewSurfacePosition = displacePosition(v_viewSurfacePosition, v_viewSurfaceNormal, displacementAmount);
  }

  gl_Position = viewToScreen * vec4( v_viewSurfacePosition, 1. );

}
