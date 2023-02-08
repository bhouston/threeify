#pragma include <tests/fragment>
#pragma include "lambert"

void tests(inout TestSuite suite) {
  assert(
    suite,
    1,
    eqAbs(BRDF_Diffuse_Lambert(vec3(1.)), vec3(RECIPROCAL_PI), 0.0000001)
  );
  assert(suite, 2, eqAbs(BRDF_Diffuse_Lambert(vec3(0.)), vec3(0), 0.0000001));

}
