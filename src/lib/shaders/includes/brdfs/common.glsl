#pragma once

struct DirectIllumination {
	vec3 color;
	vec3 lightDirection;
};

struct Surface {
	vec3 position;
	vec3 normal;
  vec3 tangent;
  vec3 bitangent;
  vec3 viewDirection;
};

// Get normal, tangent and bitangent vectors.
// based on the glTF reference viewer
void computeTangentFrame( inout Surface surface, vec2 tangentSpaceUv )
{
  vec3 uv_dx = dFdx(vec3(tangentSpaceUv, 0.0));
  vec3 uv_dy = dFdy(vec3(tangentSpaceUv, 0.0));

  vec3 t_ = (uv_dy.t * dFdx(surface.position) - uv_dx.t * dFdy(surface.position)) /
      (uv_dx.s * uv_dy.t - uv_dy.s * uv_dx.t);

  vec3 n, t, b, ng;
  ng = normalize(surface.normal);

  t = normalize(t_ - ng * dot(ng, t_));
  b = cross(ng, t);

  // NOTE: in the original code the ng term was saved, why?  It is the non normal map modulated normal.  Why is this needed?
  surface.normal = n;
  surface.tangent = -b;
  surface.bitangent = t;
}

void rotateTangentFrame( inout Surface surface, vec2 anisotropicDirection ) {
  // Due to anisoptry, the tangent can be further rotated around the geometric normal.
  // NOTE: The null anisotropic direction value is (1, 0, 0)
  mat3 tangentFrame = mat3(surface.tangent, surface.bitangent, surface.normal);
  surface.tangent = tangentFrame * vec3( anisotropicDirection, 0.0 );
  surface.bitangent = tangentFrame * vec3( anisotropicDirection.y, -anisotropicDirection.x, 0.0 );
}

// this should be done after rotating the tangent frame
void perturbSurfaceNormal( inout Surface surface, vec3 normal ) {

  // NOTE: it appears that if you distort the normal via a normal map you do not have to change tangent or bitangent.
  // It appears that you can do that normal moduluation after this tangent frame construction
  surface.normal = mat3(surface.tangent, surface.bitangent, surface.normal) * normalize(normal);

}

// this likely should be done after perturbing and rotating.
void alignSurfaceWithViewDirection( inout Surface surface ) {

  // For a back-facing surface, the tangential basis vectors are negated.
  float facing = step(0.0, dot(surface.viewDirection, surface.normal)) * 2.0 - 1.0;
  surface.tangent *= facing;
  surface.bitangent *= facing;
  surface.normal *= facing;

}
