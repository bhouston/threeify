#pragma once

/**
 * modified verison of the Three.js implementation of:
 * http://api.unrealengine.com/attachments/Engine/Rendering/LightingAndShadows/BumpMappingWithoutTangentSpace/mm_sfgrad_bump.pdf
 */
vec3 perturbNormalFromBumpMap( in vec3 position, in vec3 normal, in sampler2D bumpMap, in vec2 bumpUv, in float bumpScale ) {

  vec3 dPdx = normalize( dFdx( position ) );
  vec3 dPdy = normalize( dFdy( position ) );

  // screen space bump map gradient
	vec2 gradBump = vec2(
      texture2D( bumpMap, bumpUv + dFdx( bumpUv ) ).x,
		  texture2D( bumpMap, bumpUv + dFdy( bumpUv ) ).x ) -
      texture2D( bumpMap, bumpUv ).x;
  gradBump *= bumpScale; // scale in world space.

  // screen oriented orthogonal basis
  vec3 R1 = cross( dPdy, normal );
  vec3 R2 = cross( normal, dPdx );

  float fDet = dot( dPdx, R1 );

  fDet *= ( float( gl_FrontFacing ) * 2. - 1. );

  vec3 vGrad = sign( fDet ) * ( gradBump.x * R1 + gradBump.y * R2 );

  return normalize( abs( fDet ) * normal - vGrad );

}
