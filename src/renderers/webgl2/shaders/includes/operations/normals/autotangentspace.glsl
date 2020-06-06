
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
