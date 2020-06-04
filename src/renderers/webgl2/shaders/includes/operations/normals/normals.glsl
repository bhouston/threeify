// Usage: normal *= frontFaceNormalFactor() 
float frontFaceNormalFactor() {
    return float( gl_FrontFacing ) * 2.0 - 1.0;
}

mat3 tangentToLocalTransform( vec3 tangent, vec3 bitangent, vec3 normal ) {
    // TODO: ensure things are noramlized before they get here.  This is wasteful.
    return mat3( normalize( tangent ), normalize( bitangent ), normalize( normal ) );
}

//vec3 normalDelta = rgbToNormal( texture2D( normalMap, uv( normalUvIndex ) ).xyz ); // overrides both flatShading and attribute normals
