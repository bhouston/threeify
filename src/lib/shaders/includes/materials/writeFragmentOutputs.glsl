#pragma once
#pragma include <normals/normalPacking>
#pragma include <math/unitIntervalPacking>

#define FRAGMENT_OUTPUT_BEAUTY 0x01
#define FRAGMENT_OUTPUT_ALBEDO 0x02
#define FRAGMENT_OUTPUT_NORMAL 0x04
#define FRAGMENT_OUTPUT_DEPTH  0x08
#define FRAGMENT_OUTPUT_ROUGHNESS  0x10
#define FRAGMENT_OUTPUT_METALNESS  0x20
#define FRAGMENT_OUTPUT_EMISSIVE  0x40
#define FRAGMENT_OUTPUT_DIFFUSE  0x80
#define FRAGMENT_OUTPUT_SPECULAR  0x100
#define FRAGMENT_OUTPUT_DEPTH_PACKED  0x200

bool isBitSet( int value, int bit ) {
  return ( value == bit );
}

void writeFragmentOutputs( int fragmentOutputs, float normalizedDepth, vec3 viewNormal, vec3 albedo, float metalness, float roughness, vec3 beauty, vec3 diffuse, vec3 specular ) {

  vec4 result = vec4( 1., 0., 0., 1. );

  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_DEPTH ) ) {
    result.rgb = vec3( normalizedDepth );
  }
  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_DEPTH_PACKED ) ) {
    result = unitIntervalToVec4( normalizedDepth );
  }
  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_NORMAL ) ) {
    result.rgb = normalToRgb( viewNormal );
  }
  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_ALBEDO ) ) {
    result.rgb = albedo;
  }
  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_METALNESS ) ) {
    result.r = metalness;
  }
  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_ROUGHNESS ) ) {
    result.b = roughness;
  }
  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_BEAUTY ) ) {
    result.rgb = beauty;
  }
  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_DIFFUSE ) ) {
    result.rgb = diffuse;
  }
  if( isBitSet( fragmentOutputs, FRAGMENT_OUTPUT_SPECULAR ) ) {
    result.rgb = specular;
  }

  gl_FragColor = result;
}
