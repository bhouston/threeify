#pragma import "../tests/fragment.glsl"
#pragma import "./normalPacking.glsl"

void testEquivalency(inout TestSuite suite, int testId, vec3 normal) {
  vec3 rgb = normalToRgb(normal);
  vec3 normal2 = rgbToNormal(rgb);
  assert(suite, testId, eqAbs(normal, normal2, 0.0001));
}

void tests(inout TestSuite suite) {
  vec3 px = vec3(1.0, 0.0, 0.0);
  vec3 py = vec3(0.0, 1.0, 0.0);
  vec3 pz = vec3(0.0, 0.0, 1.0);

  testEquivalency(suite, 3, px);
  testEquivalency(suite, 4, -px);
  testEquivalency(suite, 5, py);
  testEquivalency(suite, 6, -py);
  testEquivalency(suite, 7, pz);
  testEquivalency(suite, 8, -pz);

}
