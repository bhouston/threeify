#pragma import "../../tests/fragment.glsl"
#pragma import "./rgbe.glsl"

void testEquivalency(inout TestSuite suite, int testId, vec3 linear) {
  vec4 rgbe = linearToRGBE(linear);
  vec3 linear2 = rgbeToLinear(rgbe);
  assert(suite, testId, eqRel(linear, linear2, 0.01));
}

void tests(inout TestSuite suite) {
  testEquivalency(suite, 1, vec3(0.0001, 0.001, 0.01));
  testEquivalency(suite, 2, vec3(0.001));
  testEquivalency(suite, 3, vec3(0.01));
  testEquivalency(suite, 4, vec3(0.1, 1.0, 10.0));
  testEquivalency(suite, 5, vec3(1.0));
  testEquivalency(suite, 6, vec3(10.0));
  testEquivalency(suite, 7, vec3(100.0));
  testEquivalency(suite, 8, vec3(1000.0, 100.0, 10.0));

}
