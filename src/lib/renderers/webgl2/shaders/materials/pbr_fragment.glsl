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

vec3 ( vec3 modulator, sampler2D map, vec2 uv ) {
    texture2D( map, uv );
}

pbr_brdf(
    vec3 albedo,
    float roughness,
    float metalness,
    vec3 emissive,
     ) {

 }

void main() {

    vec3 albedo = albedoModular * texture2D( albedoMap, uv( albedoUVIndex ) );
    float roughness = metalnessModular * texture2D( roughnessMap, uv( roughnessUVIndex ) ).g;
    float metalness = metalnessModular * texture2D( metalnessMap, uv( metalnessUVIndex ) ).b;
    
    gl_color = vec4(1, 0, 0.5, 1);
}