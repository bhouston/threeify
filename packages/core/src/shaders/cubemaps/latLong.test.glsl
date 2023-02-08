#pragma include <tests/fragment>
#pragma include "latLong"

void testEquivalency(inout TestSuite suite, int testId, vec3 dir) {
  vec2 uv0 = directionToLatLongUV(dir);
  vec3 dir2 = latLongUvToDirection(uv0);
  vec2 uv2 = directionToLatLongUV(dir2);
  assert(suite, testId, eqAbs(dir, dir2, 0.00001));
  assert(suite, testId + 1, eqAbs(uv0, uv2, 0.00001));
}

void tests(inout TestSuite suite) {
  assert(
    suite,
    0,
    eqAbs(directionToLatLongUV(vec3(-1, 0, 0)), vec2(0.25, 0.5), 0.00001)
  );
  assert(
    suite,
    1,
    eqAbs(directionToLatLongUV(vec3(0, 0, -1)), vec2(0.5, 0.5), 0.00001)
  );
  assert(
    suite,
    2,
    eqAbs(directionToLatLongUV(vec3(1, 0, 0)), vec2(0.75, 0.5), 0.00001)
  );
  assert(
    suite,
    3,
    eqAbs(directionToLatLongUV(vec3(0, 0, 1)), vec2(0., 0.5), 0.00001)
  );

  assert(
    suite,
    10,
    eqAbs(latLongUvToDirection(vec2(0.5, 0.5)), vec3(0., 0., -1.), 0.00001)
  );
  assert(
    suite,
    11,
    eqAbs(latLongUvToDirection(vec2(0., 0.5)), vec3(0., 0., 1.), 0.00001)
  );
  assert(
    suite,
    12,
    eqAbs(latLongUvToDirection(vec2(1., 0.5)), vec3(0., 0., 1.), 0.00001)
  );
  assert(
    suite,
    13,
    eqAbs(latLongUvToDirection(vec2(0.5, 0.)), vec3(0., 1., 0.), 0.00001)
  );
  assert(
    suite,
    14,
    eqAbs(latLongUvToDirection(vec2(0.5, 1.)), vec3(0., -1., 0.), 0.00001)
  );
  assert(
    suite,
    15,
    eqAbs(latLongUvToDirection(vec2(0.25, 0.5)), vec3(-1., 0., 0.), 0.00001)
  );
  assert(
    suite,
    16,
    eqAbs(latLongUvToDirection(vec2(0.75, 0.5)), vec3(1., 0., 0.), 0.00001)
  );

  testEquivalency(suite, 20, vec3(0., 0., 1.));
  testEquivalency(suite, 30, vec3(0., 0., -1.));
  testEquivalency(suite, 40, normalize(vec3(1., 1., 1.)));
  testEquivalency(suite, 50, normalize(vec3(1., -1., 1.)));
  testEquivalency(suite, 60, vec3(1., 0., 0.));
  testEquivalency(suite, 70, vec3(-1., 0., 0.));
  testEquivalency(suite, 80, normalize(vec3(-1., 1., 1.)));
  testEquivalency(suite, 90, normalize(vec3(-1., -1., 1.)));
  testEquivalency(suite, 110, normalize(vec3(-1., 1., -1.)));
  testEquivalency(suite, 120, normalize(vec3(-1., -1., -1.)));
  testEquivalency(suite, 130, normalize(vec3(1., 1., -1.)));
  testEquivalency(suite, 140, normalize(vec3(1., -1., -1.)));

}
