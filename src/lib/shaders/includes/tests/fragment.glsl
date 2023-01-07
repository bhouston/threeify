#pragma once
precision highp float;

in vec2 v_uv;

out vec4 outputColor;

struct TestSuite {
  int selectorResult;
  int selectorId;
};

// IDEA: Varying which suite test to run based on a varying from the vertex shader.
//  This one can have multiple identified failures per run.

bool eqAbs(float rhs, float lhs, float tolerance) {
  return abs(rhs - lhs) < tolerance;
}

bool eqAbs(vec2 rhs, vec2 lhs, float tolerance) {
  return eqAbs(rhs.x, lhs.x, tolerance) && eqAbs(rhs.y, lhs.y, tolerance);
}

bool eqAbs(vec3 rhs, vec3 lhs, float tolerance) {
  return eqAbs(rhs.x, lhs.x, tolerance) &&
  eqAbs(rhs.y, lhs.y, tolerance) &&
  eqAbs(rhs.z, lhs.z, tolerance);
}

bool eqAbs(vec4 rhs, vec4 lhs, float tolerance) {
  return eqAbs(rhs.x, lhs.x, tolerance) &&
  eqAbs(rhs.y, lhs.y, tolerance) &&
  eqAbs(rhs.z, lhs.z, tolerance) &&
  eqAbs(rhs.w, lhs.w, tolerance);
}

bool eqRel(float rhs, float lhs, float tolerance) {
  return abs(rhs - lhs) / max(abs(rhs), abs(lhs)) < tolerance;
}

bool eqRel(vec2 rhs, vec2 lhs, float tolerance) {
  return eqRel(rhs.x, lhs.x, tolerance) && eqRel(rhs.y, lhs.y, tolerance);
}

bool eqRel(vec3 rhs, vec3 lhs, float tolerance) {
  return eqRel(rhs.x, lhs.x, tolerance) &&
  eqRel(rhs.y, lhs.y, tolerance) &&
  eqRel(rhs.z, lhs.z, tolerance);
}

bool eqRel(vec4 rhs, vec4 lhs, float tolerance) {
  return eqRel(rhs.x, lhs.x, tolerance) &&
  eqRel(rhs.y, lhs.y, tolerance) &&
  eqRel(rhs.z, lhs.z, tolerance) &&
  eqRel(rhs.w, lhs.w, tolerance);
}

void assert(inout TestSuite suite, int id, bool value) {
  if (id != suite.selectorId) {
    return;
  }

  // duplicate usage of selectorId
  if (suite.selectorResult != 2) {
    suite.selectorResult = 3;
    return;
  }

  suite.selectorResult = value ? 1 : 0;
}

// TODO: Is this actually useful?
#define assertNotNaN(suite, id, value) asset(suite, id, !isnan(value));
#define assertEqual(suite, id, lhs, rhs) asset(suite, id, (lhs) == (rhs));
#define assertNotEqual(suite, id, lhs, rhs) asset(suite, id, (lhs) != (rhs));
#define assertGreater(suite, id, lhs, rhs) asset(suite, id, (lhs) > (rhs));
#define assertGreaterOrEqual(suite, id, lhs, rhs)                              \
  asset ( suite , id , ( lhs ) = > ( rhs ) ) ;
#define assertLess(suite, id, lhs, rhs) asset(suite, id, (lhs) < (rhs));
#define assertLessOrEqual(suite, id, lhs, rhs)                                 \
  asset(suite, id, (lhs) <= (rhs));

void initSuite(inout TestSuite suite) {
  suite.selectorId = int(floor(v_uv.x * 1024.0));
  suite.selectorResult = 2;

}

vec4 toSuiteResult(TestSuite suite) {
  return vec4(0.0, 0.0, float(suite.selectorResult) / 255.0, 1.0);
}

void tests(inout TestSuite suite);

void main() {
  TestSuite suite;

  initSuite(suite);

  tests(suite);

  outputColor = toSuiteResult(suite);

}
