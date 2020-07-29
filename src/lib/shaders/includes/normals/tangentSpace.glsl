#pragma once

/**
 * Get normal, tangent and bitangent vectors.
 * based on the glTF reference viewer
 */
mat3 tangentToViewFromPositionNormalUV( vec3 position, in vec3 normal, in vec2 uv ) {
  vec3 tempTangent = dFdy( uv.y ) * dFdx( position ) - dFdx( uv.y ) * dFdy( position );

  normal = normalize( normal );
  vec3 tangent = normalize(tempTangent - normal * dot( normal, tempTangent ) );
  vec3 bitangent = -cross( normal, tangent );

  return mat3( tangent, bitangent, normal );
}
