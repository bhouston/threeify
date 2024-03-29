#pragma import "../../tests/fragment.glsl"
#pragma import "./lambert.glsl"

void tests(inout TestSuite suite) {
  assert(
    suite,
    1,
    eqAbs(BRDF_Diffuse_Lambert(vec3(1.0)), vec3(RECIPROCAL_PI), 0.0000001)
  );
  assert(suite, 2, eqAbs(BRDF_Diffuse_Lambert(vec3(0.0)), vec3(0), 0.0000001));

}
