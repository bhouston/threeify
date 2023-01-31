#pragma include <tests/fragment>
#pragma include "mat4"
#pragma include <math/math>

void testMatEquals(inout TestSuite suite, int id, mat4 m, mat4 target) {
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      assert(suite, id + i * 4 + j, eqAbs(m[i][j], target[i][j], 0.000001));
    }
  }
}

void tests(inout TestSuite suite) {
  mat4 uninitialized;

  mat4 zero = mat4(
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
  );
  testMatEquals(suite, 40, uninitialized, zero);

  mat4 reference = mat4(
    0.0,
    1.0,
    2.0,
    3.0,
    4.0,
    5.0,
    6.0,
    7.0,
    8.0,
    9.0,
    10.0,
    11.0,
    12.0,
    13.0,
    14.0,
    15.0
  );

  mat4 refByIdentity = reference * mat4Identity();
  testMatEquals(suite, 80, refByIdentity, reference);

  mat4 vec = mat4(
    vec4(0.0, 1.0, 2.0, 3.0),
    vec4(4.0, 5.0, 6.0, 7.0),
    vec4(8.0, 9.0, 10.0, 11.0),
    vec4(12.0, 13.0, 14.0, 15.0)
  );
  testMatEquals(suite, 100, vec, reference);

  mat4 manual;
  manual[0] = vec4(0.0, 1.0, 2.0, 3.0);
  manual[1].zyxw = vec4(6.0, 5.0, 4.0, 7.0);
  manual[2].x = 8.0;
  manual[2][1] = 9.0;
  manual[2][2] = 10.0;
  manual[2][3] = 11.0;
  manual[3] = vec4(12.0, 13.0, 14.0, 15.0);
  testMatEquals(suite, 120, manual, reference);
}
