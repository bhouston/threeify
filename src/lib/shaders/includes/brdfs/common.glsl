#pragma once

struct DirectIllumination {
	vec3 color;
	vec3 incidentDirection;
};

struct Surface {
	vec3 position;
	vec3 normal;
};

struct View {
  vec3 viewDirection;
};
