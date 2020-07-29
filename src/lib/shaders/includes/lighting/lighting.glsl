#pragma once

struct DirectLight {
	vec3 radiance;        // in standard BRDF notation: L[i](w[i])
	vec3 direction;  // in standard BRDF notation: w[i]
};
