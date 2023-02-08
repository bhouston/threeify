#pragma once

vec2 decodeDirection(vec2 value) {
  return value * 2. - 1.;
}

/**
 * Get normal, tangent and bitangent vectors. based on the glTF reference viewer
 */
mat3 tangentToViewFromPositionNormalUV(vec3 position, vec3 normal, vec2 uv0) {
  vec3 tempTangent =
    dFdy(uv0.y) * dFdx(position) - dFdx(uv0.y) * dFdy(position);

  normal = normalize(normal);
  vec3 tangent = normalize(tempTangent - normal * dot(normal, tempTangent));
  vec3 bitangent = -cross(normal, tangent);

  return mat3(tangent, bitangent, normal);
}

// from glTF IBL Sampler.
mat3 tangentToViewFromNormal(const vec3 normal) {
  vec3 bitangent = vec3(0., 1., 0.);
  if (abs(normal.y) > abs(normal.x) && abs(normal.y) > abs(normal.z)) {
    // Sampling +Y or -Y, so we need a more robust bitangent.
    if (normal.y > 0.) {
      bitangent = vec3(0., 0., 1.);
    } else {
      bitangent = vec3(0., 0., -1.);
    }
  }

  vec3 tangent = cross(bitangent, normal);
  bitangent = cross(normal, tangent);
  return mat3(tangent, bitangent, normal);
}

vec3 transformTangentByFlow(
  vec2 flowDirection,
  const vec3 tangent,
  const vec3 bitangent
) {
  return normalize(flowDirection.x * tangent + flowDirection.y * bitangent);
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

