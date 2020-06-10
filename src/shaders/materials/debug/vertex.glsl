#pragma include( "math/math.glsl" )

// uniforms
uniform mat4 localToWorldTransform; // node
uniform mat4 worldToViewTransform; // camera
uniform mat4 viewToScreenProjection; // projection


// attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv0;


// varyings to fragment shader
varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv0;


void main() {

    mat4 localToViewTransform = localToWorldTransform * worldToViewTransform;

    v_viewPosition = ( localToViewTransform * vec4( position, 1.0 ) ).xyz;
    v_viewNormal = normalize( ( localToViewTransform * vec4( normal, 0.0 ) ).xyz );
    v_uv0 = uv0;

    gl_Position = ( localToViewTransform * viewToScreenProjection ) * vec4( position, 1.0 );

}
