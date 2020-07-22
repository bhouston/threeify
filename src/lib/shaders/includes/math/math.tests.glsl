#pragma include <unit/fragment>
#pragma include "math"

void tests( inout TestResults results ) {

  assert( results, 10, eqAbs( cos( PI ), -1., 0.000001 ) );
  assert( results, 11, eqAbs( cos( PI2 ), 1., 0.000001 ) );

  assert( results, 20, eqAbs( sin( PI ), 0., 0.000001 ) );
  assert( results, 21, eqAbs( sin( PI2 ), 0., 0.000001 ) );

  assert( results, 31, eqAbs( 0.5 * PI, PI_HALF, 0.000001 ) );

  assert( results, 41, eqAbs( 1.0 / PI, RECIPROCAL_PI, 0.000001 ) );
  assert( results, 42, eqAbs( 1.0 / PI2, RECIPROCAL_PI2, 0.000001 ) );

  assert( results, 50, eqAbs( saturate( -2.), 0., 0.000001 ) );
  assert( results, 51, eqAbs( saturate( 2.), 1., 0.000001 ) );

  assert( results, 60, eqAbs( whiteComplement( vec3( 1.0, 0.5, 0.0 ) ), vec3( 0.0, 0.5, 1.0 ), 0.000001 ) );

  assert( results, 70, pow2( 2.0 ) == 4.0 );
  assert( results, 71, pow2( -2.0 ) == 4.0 );

  assert( results, 80, pow3( 2.0 ) == 8.0 );
  assert( results, 81, pow3( -2.0 ) == -8.0 );

  assert( results, 90, pow4( 2.0 ) == 16.0 );
  assert( results, 91, pow4( -2.0 ) == 16.0 );

  assert( results, 100, eqAbs( average( vec3( -2.0 ) ), -2.0, 0.000001 ) );
  assert( results, 101, eqAbs( average( vec3( 10., 20., 30. ) ), 20., 0.000001 ) );

  float divisor = 0.;
  assert( results, 110, ! isinf( 0. / 1. ) );
  assert( results, 112, isinf( 1. / divisor ) );

  assert( results, 120, isnan( sqrt( 0. ) ) );
  assert( results, 122, isnan( atan( 0. ) ) );

  // should be undefined according to spec: https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/atan.xhtml
  assert( results, 126, atan( 1., 0. ) == PI_HALF );

}
