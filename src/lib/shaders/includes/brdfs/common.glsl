#pragma once

struct DirectIllumination {
	vec3 color;
	vec3 lightDirection;
};

struct Surface {
	vec3 position;
	vec3 normal;
  vec3 tangent;
  vec3 bitangent;
  vec3 viewDirection;
};

mat3 surfaceToNormalMatrix( in Surface surface ) {
  return mat3(surface.tangent, surface.bitangent, surface.normal);
}
// Get normal, tangent and bitangent vectors.
// based on the glTF reference viewer
void uvToTangentFrame( inout Surface surface, in vec2 uv ) {
  vec3 tempTangent = dFdx( uv.y ) * dFdy(surface.position) - dFdy( uv.y ) * dFdx(surface.position);

  surface.normal = normalize(surface.normal);
  surface.bitangent = -normalize(tempTangent - surface.normal * dot(surface.normal, tempTangent));
  surface.tangent = -cross(surface.normal, surface.bitangent);
}

void rotateTangentFrame( inout Surface surface, in vec2 anisotropicDirection ) {
  // Due to anisoptry, the tangent can be further rotated around the geometric normal.
  // NOTE: The null anisotropic direction value is (1, 0, 0)
  mat3 normalMatrix = surfaceToNormalMatrix( surface );
  surface.tangent = normalMatrix * vec3( anisotropicDirection, 0. );
  surface.bitangent = normalMatrix * vec3( anisotropicDirection.y, -anisotropicDirection.x, 0. );
}

// this should be done after rotating the tangent frame
void perturbSurfaceNormal_ObjectSpace( inout Surface surface, in vec3 normal ) {
  // NOTE: it appears that if you distort the normal via a normal map you do not have to change tangent or bitangent.
  // It appears that you can do that normal moduluation after this tangent frame construction
  mat3 normalMatrix = surfaceToNormalMatrix( surface );
  surface.normal = normalMatrix * normalize(normal);
}

// this should be done after rotating the tangent frame
void perturbSurfaceNormal_TangentSpace( inout Surface surface, in vec3 normal ) {
  // NOTE: it appears that if you distort the normal via a normal map you do not have to change tangent or bitangent.
  // It appears that you can do that normal moduluation after this tangent frame construction
  mat3 normalMatrix = surfaceToNormalMatrix( surface );
  surface.normal = normalMatrix * normalize( normal );
}
// this likely should be done after perturbing and rotating.
void alignSurfaceWithViewDirection( inout Surface surface ) {

  // For a back-facing surface, the tangential basis vectors are negated.
  float facing = step(0., dot(surface.viewDirection, surface.normal)) * 2. - 1.;
  surface.tangent *= facing;
  surface.bitangent *= facing;
  surface.normal *= facing;

}

// modified verison of the Three.js implementation of:
// http://api.unrealengine.com/attachments/Engine/Rendering/LightingAndShadows/BumpMappingWithoutTangentSpace/mm_sfgrad_bump.pdf
void perturbSurfaceNormal_BumpMap( inout Surface surface, in sampler2D bumpMap, in vec2 bumpUv, in float bumpScale ) {

  vec3 dPdx = normalize( dFdx( surface.position ) );
  vec3 dPdy = normalize( dFdy( surface.position ) );

  // screen space bump map gradient
	vec2 gradBump = vec2(
      texture2D( bumpMap, bumpUv + dFdx( bumpUv ) ).x,
		  texture2D( bumpMap, bumpUv + dFdy( bumpUv ) ).x ) -
      texture2D( bumpMap, bumpUv ).x;
  gradBump *= bumpScale; // scale in world space.

  // screen oriented orthogonal basis
  vec3 R1 = cross( dPdy, surface.normal );
  vec3 R2 = cross( surface.normal, dPdx );

  float fDet = dot( dPdx, R1 );

  fDet *= ( float( gl_FrontFacing ) * 2. - 1. );

  vec3 vGrad = sign( fDet ) * ( gradBump.x * R1 + gradBump.y * R2 );
  surface.normal = normalize( abs( fDet ) * surface.normal - vGrad );

}
