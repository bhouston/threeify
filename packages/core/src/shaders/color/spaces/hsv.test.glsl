#pragma import "../../tests/fragment.glsl"
#pragma import "./hsv.glsl"

void testHsvToColor(
  inout TestSuite suite,
  int testId,
  vec3 hsv,
  vec3 expectedRgb
) {
  vec3 rgb = hsvToColor(hsv.x, hsv.y, hsv.z);
  assert(suite, testId, eqAbs(rgb, expectedRgb, 0.001));
}

void hsvTests(inout TestSuite suite) {
  testHsvToColor(suite, 6, vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0));
  testHsvToColor(suite, 7, vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 0.0));
  testHsvToColor(suite, 8, vec3(1.0 / 3.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0));
  testHsvToColor(suite, 9, vec3(2.0 / 3.0, 1.0, 1.0), vec3(0.0, 0.0, 1.0));
  testHsvToColor(suite, 10, vec3(1.0 / 6.0, 1.0, 1.0), vec3(1.0, 1.0, 0.0));
}

