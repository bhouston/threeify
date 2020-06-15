attribute vec4 position;
attribute vec3 normal;
attribute vec2 uv0;
attribute vec2 uv1; // if there is no uv1 on the geometry, this will be a copy of uv0
attribute vec2 uv2; // if there is no uv1 on the geometry, this will be a copy of uv0
attribute vec2 uv3; // if there is no uv1 on the geometry, this will be a copy of uv0

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv0;
varying vec2 v_uv1;
varying vec2 v_uv2;

uniform mat4 localToView;  // geometry
uniform mat4 viewToScreen; // camera

#pragma include <math/matrix4>

void main() {

    v_viewPosition = transformPosition( localToView, position );
    v_viewNormal = transformNormal( localToView, normal );
    v_uv0 = uv0;
    v_uv1 = uv1;
    v_uv2 = uv2;

    gl_Position = projectPosition( localToWorld * localToWorld, position );
}
