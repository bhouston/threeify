// with a defined tangent space
vec3 tangentSpaceNormalDelta( vec3 normalDelta, mat3 tangentToLocal )
	return normalize( tangentToLocal * normalDelta );
}

