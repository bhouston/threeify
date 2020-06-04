vec3 transformPosition( in vec3 p, in mat4 m ) {
    return ( m * vec4( p, 0.0 ) ).xyz;

vec3 transformDirection( in vec3 d, in mat4 m ) {

	return normalize( ( m * vec4( dir, 0.0 ) ).xyz );

}

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {

	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal

	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );

}
