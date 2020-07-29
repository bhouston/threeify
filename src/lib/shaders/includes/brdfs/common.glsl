#pragma once

struct DirectLight {
	vec3 radiance;        // in standard BRDF notation: L[i](w[i])
	vec3 direction;  // in standard BRDF notation: w[i]
};

struct Surface {
	vec3 position;
	vec3 normal;
  vec3 tangent;
  vec3 bitangent;
  vec3 viewDirection;
};

vec3 specularIntensityToF0( in vec3 specularIntensity ) {
  return specularIntensity * specularIntensity * 0.16;
}


/*
mat3 makeTangentToViewTransformFromSurface( in Surface surface ) {
  return mat3( surface.tangent, surface.bitangent, surface.normal );
}

vec3 flatSurfaceNormal( vec3 position ) {
  return normalize( cross( dFdx( position ), dFdy( position ) ) );
}

void tangentToViewTransformFromSurfaceAndUV( inout Surface surface, in vec2 uv ) {
  vec3 tempTangent = dFdy( uv.y ) * dFdx( surface.position ) - dFdx( uv.y ) * dFdy( surface.position );

  surface.normal = normalize( surface.normal );
  surface.tangent = normalize(tempTangent - surface.normal * dot( surface.normal, tempTangent ) );
  surface.bitangent = -cross( surface.normal, surface.tangent );
}
*/



/*
mat3 rotateTangentSpace( in mat3 tangentToView, in vec2 anisotropicDirection ) {
  // Due to anisoptry, the tangent can be further rotated around the geometric normal.
  // NOTE: The null anisotropic direction value is (1, 0, 0)
  return tangentToView * mat3RotateZDirection( anisotropicDirection.yx );
}*/

/*

/**
 * this should be done after rotating the tangent frame
 * /
mat3 normalMapToTangentSpaceTransform( in vec3 normal, int vec2 normalScale ) {
  mat3 result = mat3Identity();
  result[2] = normal;
  return xfrm;
}*/

/**
 * this likely should be done after perturbing and rotating.
 */
void alignSurfaceWithViewDirection( inout Surface surface ) {

  // For a back-facing surface, the tangential basis vectors are negated.
  float facing = step( 0., dot( surface.viewDirection, surface.normal ) ) * 2. - 1.;
  surface.tangent *= facing;
  surface.bitangent *= facing;
  surface.normal *= facing;

}
