export default /* glsl */ `
precision highp float;

// uniforms
uniform mat4 localToWorldTransform; // node
uniform mat4 worldToViewTransform; // camera
uniform mat4 viewToScreenProjection; // projection

uniform vec3 albedo; // material
uniform int albedoUvIndex; // material
uniform sampler2D albedoMap; // material


// varyings from vertex shader
varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv0;


vec2 uv( int uvIndex ) {
    if( uvIndex == 0 ) return v_uv0;
    /*if( uvIndex == 1 ) return v_uv1;
    if( uvIndex == 2 ) return v_uv2;
    if( uvIndex == 3 ) return v_uv3;*/
    return vec2(0,0);
}


void main() {

    gl_FragColor.xyz = albedo * texture2D( albedoMap, uv( albedoUvIndex ) ).xyz;

}
`;
