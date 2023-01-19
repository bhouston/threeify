#pragma include <tests/fragment>
#pragma include "unitIntervalPacking"

void testEquivalency(inout TestSuite suite, int testId, float value) {
  vec2 packed2 = unitIntervalToVec2(value);
  packed2.x = float(int(packed2.x * 255.0)) / 255.0;
  packed2.y = float(int(packed2.y * 255.0)) / 255.0;
  float value2 = vec2ToUnitInterval(packed2);
  assert(suite, testId + 2, eqAbs(value, value2, 1.0 / (255.0 * 255.0)));

  vec3 packed3 = unitIntervalToVec3(value);
  packed3.x = float(int(packed3.x * 255.0)) / 255.0;
  packed3.y = float(int(packed3.y * 255.0)) / 255.0;
  packed3.z = float(int(packed3.z * 255.0)) / 255.0;
  float value3 = vec3ToUnitInterval(packed3);
  assert(
    suite,
    testId + 3,
    eqAbs(value, value3, 1.0 / (255.0 * 255.0 * 255.0))
  );

  vec4 packed4 = unitIntervalToVec4(value);
  packed4.x = float(int(packed4.x * 255.0)) / 255.0;
  packed4.y = float(int(packed4.y * 255.0)) / 255.0;
  packed4.z = float(int(packed4.z * 255.0)) / 255.0;
  packed4.w = float(int(packed4.w * 255.0)) / 255.0;
  float value4 = vec4ToUnitInterval(packed4);
  assert(
    suite,
    testId + 4,
    eqAbs(value, value4, 1.0 / (255.0 * 255.0 * 255.0 * 255.0))
  );
}

void tests(inout TestSuite suite) {
  testEquivalency(suite, 10, 0.0);
  testEquivalency(suite, 20, 0.000001);
  testEquivalency(suite, 30, 0.000002);
  testEquivalency(suite, 40, 0.000003);
  testEquivalency(suite, 50, 0.00000321);
  testEquivalency(suite, 60, 0.000006421);
  testEquivalency(suite, 70, 0.00001);
  testEquivalency(suite, 80, 0.00002);
  testEquivalency(suite, 90, 0.00003);
  testEquivalency(suite, 100, 0.0000321);
  testEquivalency(suite, 110, 0.00006421);
  testEquivalency(suite, 120, 0.0001);
  testEquivalency(suite, 130, 0.0002);
  testEquivalency(suite, 140, 0.0003);
  testEquivalency(suite, 150, 0.000321);
  testEquivalency(suite, 160, 0.0006421);
  testEquivalency(suite, 170, 0.001);
  testEquivalency(suite, 180, 0.002);
  testEquivalency(suite, 190, 0.003);
  testEquivalency(suite, 200, 0.00321);
  testEquivalency(suite, 210, 0.006421);
  testEquivalency(suite, 220, 0.01);
  testEquivalency(suite, 230, 0.02);
  testEquivalency(suite, 240, 0.03);
  testEquivalency(suite, 250, 0.0321);
  testEquivalency(suite, 260, 0.06421);
  testEquivalency(suite, 270, 0.1);
  testEquivalency(suite, 280, 0.2);
  testEquivalency(suite, 290, 0.3);
  testEquivalency(suite, 300, 0.321);
  testEquivalency(suite, 310, 0.6421);
  testEquivalency(suite, 320, 1.0);

}
