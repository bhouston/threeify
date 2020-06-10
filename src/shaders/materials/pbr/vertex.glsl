//
// attributes
//

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
varying vec2 v_uv3;

//
// uniforms
//

// geometry
uniform mat4 localToWorld;

// camera
uniform mat4 worldToScreen;

//
// varyings from the vertex shader
//


#include <../../includes/math/matrix4>

void main() {

    v_position = transformPosition( localToWorld, position );
    v_normal = transformNormal( localToWorld, normal );
    v_uv0 = uv0;
    v_uv1 = uv1;
    v_uv2 = uv2;
    v_uv3 = uv3;

    gl_Position = projectPosition( localToWorld * localToWorld, position );
}
