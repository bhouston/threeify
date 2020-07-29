#pragma once

struct DirectLight {
	vec3 radiance;        // in standard BRDF notation: L[i](w[i])
	vec3 direction;  // in standard BRDF notation: w[i]
};

vec3 specularIntensityToF0( in vec3 specularIntensity ) {
  return specularIntensity * specularIntensity * 0.16;
}

/*
/**
 * this likely should be done after perturbing and rotating.
 * /
void alignSurfaceWithViewDirection( inout Surface surface ) {

  // For a back-facing surface, the tangential basis vectors are negated.
  float facing = step( 0., dot( surface.viewDirection, surface.normal ) ) * 2. - 1.;
  surface.tangent *= facing;
  surface.bitangent *= facing;
  surface.normal *= facing;

}*/
