#pragma include <tests/fragment>
#pragma include "math"

struct SimpleStruct {
  float a;
  vec3 b;
};

SimpleStruct getSimpleStruct() {
  SimpleStruct ss;
  ss.a = 1.0;
  ss.b = vec3(1.0, 2.0, 3.0);
  return ss;
}

void tests(inout TestSuite suite) {
  SimpleStruct funcResult = getSimpleStruct();
  assert(suite, 10, funcResult.a == 1.0);
  assert(suite, 11, funcResult.b.x == 1.0);
  assert(suite, 12, funcResult.b.y == 2.0);
  assert(suite, 13, funcResult.b.z == 3.0);

  SimpleStruct conResult = SimpleStruct(2.0, vec3(3.0, 4.0, 5.0));
  assert(suite, 20, conResult.a == 2.0);
  assert(suite, 21, conResult.b.x == 3.0);
  assert(suite, 22, conResult.b.y == 4.0);
  assert(suite, 23, conResult.b.z == 5.0);

}
