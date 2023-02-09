#pragma include <tests/fragment>
#pragma include <math/math>

struct SimpleStruct {
  float a;
  vec3 b;
};

SimpleStruct getSimpleStruct() {
  SimpleStruct ss;
  ss.a = 1.;
  ss.b = vec3(1., 2., 3.);
  return ss;
}

void tests(inout TestSuite suite) {
  SimpleStruct funcResult = getSimpleStruct();
  assert(suite, 10, funcResult.a == 1.);
  assert(suite, 11, funcResult.b.x == 1.);
  assert(suite, 12, funcResult.b.y == 2.);
  assert(suite, 13, funcResult.b.z == 3.);

  SimpleStruct conResult = SimpleStruct(2., vec3(3., 4., 5.));
  assert(suite, 20, conResult.a == 2.);
  assert(suite, 21, conResult.b.x == 3.);
  assert(suite, 22, conResult.b.y == 4.);
  assert(suite, 23, conResult.b.z == 5.);

}
