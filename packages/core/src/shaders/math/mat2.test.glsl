#pragma include <tests/fragment>
#pragma include "mat2"

void testMatEquals(inout TestSuite suite, int id, mat2 m, mat2 target) {
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      assert(suite, id + i * 2 + j, eqAbs(m[i][j], target[i][j], 0.000001));
    }
  }
}

void tests(inout TestSuite suite) {
  mat2 uninitialized;

  mat2 zero = mat2(0.0, 0.0, 0.0, 0.0);
  testMatEquals(suite, 10, uninitialized, zero);

  mat2 reference = mat2(0.0, 1.0, 2.0, 3.0);

  mat2 refByIdentity = reference * mat2Identity();
  testMatEquals(suite, 30, refByIdentity, reference);

  mat2 vec = mat2(vec2(0.0, 1.0), vec2(2.0, 3.0));
  testMatEquals(suite, 40, vec, reference);

  mat2 manual;
  manual[0] = vec2(0.0, 1.0);
  manual[1].yx = vec2(3.0, 2.0);
  testMatEquals(suite, 50, manual, reference);

}
