
#pragma import "../tests/fragment.glsl"
#pragma import "./refraction.glsl"

void tests(inout TestSuite suite) {
  
  vec3 surfaceNormal = vec3( 1., 0., 0.);
  vec3 incidentRay = normalize( vec3( -0.5, 0.5, 0. ) );

  {
    vec3 reflectedRay = calculateReflectedRay(incidentRay, surfaceNormal);
    assert(suite, 0, length( reflectedRay - normalize( vec3( 0.5, 0.5, 0. ) ) ) < 0.0001);
  }
  {
    vec3 reflectedRay = calculateReflectedRay(-incidentRay, surfaceNormal);
    assert(suite, 1, length( reflectedRay - normalize( vec3( -0.5, -0.5, 0. ) ) ) < 0.0001);
  }

  {
    // unchanged ray.
    vec3 refractedRay = calculateRefractedRay(incidentRay, surfaceNormal, 1.0, 1.0 );
    assert(suite, 2, length( refractedRay - normalize( vec3( -0.5, 0.5, 0. ) ) ) < 0.0001);
  }
  {
    // unchanged ray.
    vec3 refractedRay = calculateRefractedRay(-incidentRay, surfaceNormal, 1.0, 1.0 );
    assert(suite, 3, length( refractedRay - normalize( vec3( 0.5, -0.5, 0. ) ) ) < 0.0001);
  }

}