#pragma once

// Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen
// http://api.unrealengine.com/attachments/Engine/Rendering/LightingAndShadows/BumpMappingWithoutTangentSpace/mm_sfgrad_bump.pdf
vec3 bumpNormalDelta( vec3 position, vec3 normal, sampler2D bumpMap, vec2 uv ) {

    vec3 dPdx = dFdx( position );
    vec3 dPdy = dFdy( position );

    vec3 tangent = cross( dPdy, normal );
    vec3 binormal = cross( normal, dPdx );
    float determinant = dot( dPdx, tangent );

    vec2 dUvdx = dFdx( uv );
    vec2 dUvdy = dFdy( uv );

    float b = texture2D( bumpMap, uv ).x;
    float dBdx = texture2D( bumpMap, uv + dUvdx ).x - b; // TODO: why not just dBdx( b )?  Wouldn't this be equivalent and faster?
    float dBdy = texture2D( bumpMap, uv + dUvdy ).x - b; // TODO: why not just dBdy( b )?  Wouldn't this be equivalent and faster?

    vec3 gradient = sign( determinant ) * ( dBdx * tangent + dBdy * binormal );

    return normalize( abs( determinant ) * normal - bumpScale * gradient );
}
