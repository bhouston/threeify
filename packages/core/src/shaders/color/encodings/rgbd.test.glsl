#pragma include <tests/fragment>
#pragma include "rgbd"

void testEquivalency(
  inout TestSuite suite,
  int testId,
  vec3 linear,
  float maxRange
) {
  vec4 rgbd = linearToRGBD(linear, maxRange);
  vec3 linear2 = rgbdToLinear(rgbd, maxRange);
  assert(suite, testId, eqRel(linear, linear2, 0.01));
}

void tests(inout TestSuite suite) {
  testEquivalency(suite, 1, vec3(0.0001, 0.001, 0.01), 16.);
  testEquivalency(suite, 2, vec3(0.001), 16.);
  testEquivalency(suite, 3, vec3(0.01), 16.);
  testEquivalency(suite, 4, vec3(0.1, 1., 10.), 16.);
  testEquivalency(suite, 5, vec3(1.), 16.);
  testEquivalency(suite, 6, vec3(10.), 16.);
  testEquivalency(suite, 7, vec3(100.), 16.);
  testEquivalency(suite, 8, vec3(1000., 100., 10.), 16.);

  testEquivalency(suite, 11, vec3(0.0001, 0.001, 0.01), 8.);
  testEquivalency(suite, 12, vec3(0.001), 128.);
  testEquivalency(suite, 13, vec3(0.01), 128.);
  testEquivalency(suite, 14, vec3(0.1, 1., 10.), 32.);
  testEquivalency(suite, 15, vec3(1.), 32.);
  testEquivalency(suite, 16, vec3(10.), 64.);
  testEquivalency(suite, 17, vec3(100.), 64.);
  testEquivalency(suite, 18, vec3(1000., 100., 10.), 64.);

}
