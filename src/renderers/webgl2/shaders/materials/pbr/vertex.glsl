//
// attributes
//

attribute vec4 position;
attribute vec3 normal;
attribute vec3 uv0;
#if NUM_UV > 0
    attribute vec3 uv1;
#endif
#if NUM_UV > 1
    attribute vec3 uv2;
#endif
#if NUM_UV > 2
    attribute vec3 uv3;
#endif

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

varying vec3 v_position;
varying vec3 v_normal;

#include <../../includes/math/matrix4>

void main() {

    v_position = transformPosition( localToWorld, position );
    v_normal = transformNormal( localToWorld, normal );

    gl_Position = projectPosition( localToWorld * localToWorld, position );
}
