vec3 transformPosition( in vec3 p, in mat4 m ) {
    return ( m * vec4( p, 1.0 ) ).xyz;
}

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

mat3 transpose( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
