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
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.,
    0.
  );
  testMatEquals(suite, 40, uninitialized, zero);

  mat4 reference = mat4(
    0.,
    1.,
    2.,
    3.,
    4.,
    5.,
    6.,
    7.,
    8.,
    9.,
    10.,
    11.,
    12.,
    13.,
    14.,
    15.
  );

  mat4 refByIdentity = reference * mat4Identity();
  testMatEquals(suite, 80, refByIdentity, reference);

  mat4 vec = mat4(
    vec4(0., 1., 2., 3.),
    vec4(4., 5., 6., 7.),
    vec4(8., 9., 10., 11.),
    vec4(12., 13., 14., 15.)
  );
  testMatEquals(suite, 100, vec, reference);

  mat4 manual;
  manual[0] = vec4(0., 1., 2., 3.);
  manual[1].zyxw = vec4(6., 5., 4., 7.);
  manual[2].x = 8.;
  manual[2][1] = 9.;
  manual[2][2] = 10.;
  manual[2][3] = 11.;
  manual[3] = vec4(12., 13., 14., 15.);
  testMatEquals(suite, 120, manual, reference);
}
