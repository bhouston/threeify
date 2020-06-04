//
// uniforms
//

// geometry
uniform mat4 localToWorld;

// material
uniform vec3  albedoModular;
uniform sampler2D albedoMap;
uniform int albedoUVIndex;
uniform float roughnessModular;
uniform sampler2D roughnessMap;
uniform int roughnessUVIndex;
uniform float metalnessModular;
uniform sampler2D metalnessMap;
uniform int metalnessUVIndex;

// lights
uniform vec3 lightsSpotColor;
uniform vec3 lightsSpotPosition;
uniform float lightsSpotFalloffExponent;
uniform float lightsSpotCutoffDistance;

// output
uniform float exposure;
uniform int toneMapping;
uniform int outputEncoding;

//
// varyings from the vertex shader
//

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv0;
varying vec2 v_uv1;
varying vec2 v_uv2;
varying vec2 v_uv3;

out vec4 outColor;

vec2 uv( int uvIndex ) {
    switch( uvIndex ) {
        case 0: return v_uv0;
        case 1: return v_uv1;
        case 2: return v_uv2;
        case 3: return v_uv3;
    }
    return vec2(0,0);
}

vec3 ( vec3 modulator, sampler2D textureMap, vec2 uv ) {
}
void main() {

    vec3 albedo = albedoModular * ( albedoMap, uv( albedoUVIndex ) );
    vec3 roughness = metalnessModular * ( roughnessMap, uv( roughnessUVIndex ) );
    vec3 metalness = metalnessModular * ( metalnessMap, uv( metalnessUVIndex ) );
    
    gl_color = vec4(1, 0, 0.5, 1);
}