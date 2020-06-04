vec3 normalToRgb( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}

vec3 rgbToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}

//vec3 normalDelta = rgbToNormal( texture2D( normalMap, uv( normalUvIndex ) ).xyz ); // overrides both flatShading and attribute normals

mat3 tangentToLocalTransform( vec3 tangent, vec3 bitangent, vec3 normal ) {
    // TODO: ensure things are noramlized before they get here.  This is wasteful.
    return mat3( normalize( tangent ), normalize( bitangent ), normalize( normal ) );
}

vec3 objectSpaceNormalDelta( vec3 normalDelta, mat3 normalMatrix ) {
    return  normalize( normalMatrix * normalDelta );;
}	

// with a defined tangent space
vec3 tangentSpaceNormalDelta( vec3 normalDelta, mat3 tangentToLocal )
	return normalize( tangentToLocal * normalDelta );
}

// Per-Pixel Tangent Space Normal Mapping
// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html
vec3 tangentSpaceNormalDelta( vec3 normalDelta, vec2 uv, vec3 position, vec3 normal ) {

    // TODO: combine this tangent matrix reconstruct with the bumpNormalDelta function below.  It should be the same theory.
    vec3 dPdx = dFdx( position );
    vec3 dPdy = dFdy( position );

    vec2 dUvdx = dFdx( uv );
    vec2 dUvdy = dFdy( uv );

    float scale = sign( dUvdy.t * dUvdx.s - dUvdx.t * dUvdy.s ); // we do not care about the magnitude

    vec3 S = normalize( ( dPdx * dUvdy.t - dPdy * dUvdx.t ) * scale );
    vec3 T = normalize( ( - dPdx * dUvdy.s + dPdy * dUvdx.s ) * scale );
    vec3 N = normalize( normal );

    mat3 tsn = mat3( S, T, N );

    normalDelta.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

    return normalize( tsn * normalDelta );

}

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

// Usage: normal *= frontFaceNormalFactor() 
float frontFaceNormalFactor() {
    return float( gl_FrontFacing ) * 2.0 - 1.0;
}