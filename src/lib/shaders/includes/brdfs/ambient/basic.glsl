#pragma once

vec3 BRDF_Ambient_Basic( const in vec3 ambient, const in vec3 albedo ) {

	return ambient * albedo;
}
