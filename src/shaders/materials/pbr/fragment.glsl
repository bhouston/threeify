varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv0;
varying vec2 v_uv1; // if there is no uv1 on the geometry, this will be a copy of uv0
varying vec2 v_uv2; // if there is no uv2 on the geometry, this will be a copy of uv0

uniform mat4 localToView;  // geometry
uniform mat4 viewToScreen; // camera

// material
uniform vec3  albedoModulator;
uniform sampler2D albedoMap;
uniform int albedoUVIndex;
uniform float roughnessModulator;
uniform sampler2D roughnessMap;
uniform int roughnessUVIndex;
uniform float metalnessModulator;
uniform sampler2D metalnessMap;
uniform int metalnessUVIndex;

// lights
uniform vec3 lightsSpotViewPosition;
uniform vec3 lightsSpotColor;
uniform float lightsSpotFalloffExponent;
uniform float lightsSpotCutoffDistance;

// output
uniform int materialOutputs;  // MaterialOutputs

#pragma include <materials/material_outputs>
#pragma include <brdfs/brdf_ggx_specular>

vec2 uv( int uvIndex ) {
    switch( uvIndex ) {
        case 0: return v_uv0;
        case 1: return v_uv1;
        case 2: return v_uv2;
    }
    return vec2(0,0);
}

void main() {

  vec4 albedo = albedoModulator * texture2D( albedoMap, uv( albedoUVIndex ) );
  float roughness = roughnessModulator * texture2D( roughnessMap, uv( roughnessUVIndex ) ).g;
  float metalness = metalnessModulator * texture2D( metalnessMap, uv( metalnessUVIndex ) ).b;

  vec4 beauty = brdf_ggx_specular( v_viewPosition, v_viewNormal, albedo, roughness, metalness );

  gl_FragColor = getMaterialOutput(
    materialOutput,
    v_viewPosition, v_viewNormal, albedo, metalness, roughness, beauty );

}
