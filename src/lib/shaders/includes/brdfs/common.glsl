#pragma once

struct DirectIllumination {
	vec3 color;
	vec3 lightDirection;
};

struct Surface {
	vec3 position;
	vec3 normal;
  vec3 viewDirection;
};
