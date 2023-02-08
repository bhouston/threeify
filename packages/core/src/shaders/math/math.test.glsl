#pragma include <tests/fragment>
#pragma include <math/math>

void tests(inout TestSuite suite) {
  float zero;
  assert(suite, 0, zero == 0.);

  vec2 zero2;
  assert(suite, 1, length(zero2) == 0.);

  vec3 zero3;
  assert(suite, 2, length(zero3) == 0.);

  vec4 zero4;
  assert(suite, 3, length(zero4) == 0.);

  assert(suite, 10, eqAbs(cos(PI), -1., 0.000001));
  assert(suite, 11, eqAbs(cos(PI2), 1., 0.000001));

  assert(suite, 20, eqAbs(sin(PI), 0., 0.000001));
  assert(suite, 21, eqAbs(sin(PI2), 0., 0.000001));

  assert(suite, 31, eqAbs(0.5 * PI, PI_HALF, 0.000001));

  assert(suite, 41, eqAbs(1. / PI, RECIPROCAL_PI, 0.000001));
  assert(suite, 42, eqAbs(1. / PI2, RECIPROCAL_PI2, 0.000001));

  assert(suite, 50, eqAbs(saturate(-2.), 0., 0.000001));
  assert(suite, 51, eqAbs(saturate(2.), 1., 0.000001));

  assert(
    suite,
    60,
    eqAbs(whiteComplement(vec3(1., 0.5, 0.)), vec3(0., 0.5, 1.), 0.000001)
  );

  assert(suite, 70, pow2(2.) == 4.);
  assert(suite, 71, pow2(-2.) == 4.);

  assert(suite, 80, pow3(2.) == 8.);
  assert(suite, 81, pow3(-2.) == -8.);

  assert(suite, 90, pow4(2.) == 16.);
  assert(suite, 91, pow4(-2.) == 16.);

  assert(suite, 100, eqAbs(average(vec3(-2.)), -2., 0.000001));
  assert(suite, 101, eqAbs(average(vec3(10., 20., 30.)), 20., 0.000001));

  float divisor = 0.;
  assert(suite, 110, !isinf(0. / 1.));
  assert(suite, 112, isinf(1. / divisor));

  assert(suite, 120, isnan(sqrt(0.)));
  assert(suite, 122, isnan(atan(0.)));

  // should be undefined according to spec: https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/atan.xhtml
  assert(suite, 126, atan(1., 0.) == PI_HALF);

  assert(suite, 200, eqAbs(degToRad(0.), PI * 0., 0.000001));
  assert(suite, 201, eqAbs(degToRad(90.), PI * 0.5, 0.000001));
  assert(suite, 202, eqAbs(degToRad(180.), PI * 1., 0.000001));
  assert(suite, 203, eqAbs(degToRad(270.), PI * 1.5, 0.000001));
  assert(suite, 204, eqAbs(degToRad(360.), PI * 2., 0.000001));

  assert(suite, 205, eqAbs(radToDeg(degToRad(0.)), 0., 0.000001));
  assert(suite, 206, eqAbs(radToDeg(degToRad(90.)), 90., 0.000001));
  assert(suite, 207, eqAbs(radToDeg(degToRad(180.)), 180., 0.000001));
  assert(suite, 208, eqAbs(radToDeg(degToRad(270.)), 270., 0.000001));
  assert(suite, 209, eqAbs(radToDeg(degToRad(360.)), 360., 0.000001));

}
