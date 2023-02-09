#pragma include <tests/fragment>
#pragma include "cubeFaces"

void testDirectionToCubeFaceUV(
  inout TestSuite suite,
  int testId,
  vec3 dir,
  int face,
  vec2 uv0
) {
  int face2;
  vec2 uv2;
  directionToCubeFaceUV(dir, face2, uv2);
  assert(suite, testId, face2 == face);
  assert(suite, testId + 1, eqAbs(uv0, uv2, 0.00001));

  vec3 dir2 = cubeFaceUVToDirection(face2, uv2);
  assert(suite, testId + 5, eqAbs(dir, dir2, 0.0001));

}

void testEquivalency(inout TestSuite suite, int testId, vec3 dir) {
  int face2;
  vec2 uv2;
  directionToCubeFaceUV(dir, face2, uv2);
  vec3 dir2 = cubeFaceUVToDirection(face2, uv2);
  assert(suite, testId, eqAbs(dir, dir2, 0.0001));
}

void testEquivalencySet(inout TestSuite suite, int testId, vec3 dir) {
  testEquivalency(suite, testId + 0, normalize(dir + vec3(0.25, 0.25, 0.25)));
  testEquivalency(suite, testId + 1, normalize(dir + vec3(0.25, 0.25, -0.25)));
  testEquivalency(suite, testId + 2, normalize(dir + vec3(0.25, -0.25, 0.25)));
  testEquivalency(suite, testId + 3, normalize(dir + vec3(0.25, -0.25, -0.25)));
  testEquivalency(suite, testId + 4, normalize(dir + vec3(-0.25, 0.25, 0.25)));
  testEquivalency(suite, testId + 5, normalize(dir + vec3(-0.25, 0.25, -0.25)));
  testEquivalency(suite, testId + 6, normalize(dir + vec3(-0.25, -0.25, 0.25)));
  testEquivalency(
    suite,
    testId + 7,
    normalize(dir + vec3(-0.25, -0.25, -0.25))
  );
}

void tests(inout TestSuite suite) {
  testDirectionToCubeFaceUV(suite, 0, vec3(1., 0., 0.), 0, vec2(0.5, 0.5));
  testDirectionToCubeFaceUV(suite, 10, vec3(-1., 0., 0.), 1, vec2(0.5, 0.5));
  testDirectionToCubeFaceUV(suite, 20, vec3(0., 1., 0.), 2, vec2(0.5, 0.5));
  testDirectionToCubeFaceUV(suite, 30, vec3(0., -1., 0.), 3, vec2(0.5, 0.5));
  testDirectionToCubeFaceUV(suite, 40, vec3(0., 0., 1.), 4, vec2(0.5, 0.5));
  testDirectionToCubeFaceUV(suite, 50, vec3(0., 0., -1.), 5, vec2(0.5, 0.5));

  testEquivalencySet(suite, 100, vec3(1., 0., 0.));
  testEquivalencySet(suite, 110, vec3(-1., 0., 0.));
  testEquivalencySet(suite, 120, vec3(0., 1., 0.));
  testEquivalencySet(suite, 130, vec3(0., -1., 0.));
  testEquivalencySet(suite, 140, vec3(0., 0., 1.));
  testEquivalencySet(suite, 150, vec3(0., 0., -1.));

}
