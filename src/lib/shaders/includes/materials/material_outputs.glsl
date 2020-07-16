#pragma once
#pragma include <normals/packing>
#pragma include "output_flags"

vec4 getMaterialOutput( int materialOutput, vec4 viewPosition, vec3 viewNormal, vec4 albedo, float metalness, float roughness, vec4 beauty ) {

  switch( materialOutput ) {
    case MATERIAL_OUTPUT_NORMAL:
      return vec4( normalToRgb( v_viewNormal ), 1. );
    case MATERIAL_OUTPUT_ALBEDO:
      return vec4( albedo );
    case MATERIAL_OUTPUT_ROUGHNESS:
      return vec4( roughness, 0., 0., 1. );
    case MATERIAL_OUTPUT_METALNESS:
      return vec4( metalness, 0., 0., 1. );
    case MATERIAL_OUTPUT_METALNESS:
      return vec4( metalness, 0., 0., 1. );
  }
  return vec4( 1., 1., 1., 1. );
}
