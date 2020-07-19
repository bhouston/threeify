#pragma include <unit/fragment>
#pragma include "math"

void tests( inout TestResults results ) {

  asset( results, 10, eqAbs( cos( PI ), -1., 0.000001 ) );
  asset( results, 11, eqAbs( cos( PI2 ), 1., 0.000001 ) );

  asset( results, 20, eqAbs( sin( PI ), 0., 0.000001 ) );
  asset( results, 21, eqAbs( sin( PI2 ), 0., 0.000001 ) );

  asset( results, 31, eqAbs( 0.5 * PI, PI_HALF, 0.000001 ) );

  asset( results, 41, eqAbs( 1.0 / PI, RECIPROCAL_PI, 0.000001 ) );
  asset( results, 42, eqAbs( 1.0 / PI2, RECIPROCAL_PI2, 0.000001 ) );

  asset( results, 50, eqAbs( saturate( -2.), 0., 0.000001 ) );
  asset( results, 51, eqAbs( saturate( 2.), 1., 0.000001 ) );

  asset( results, 60, eqAbs( whiteComplement( vec3( 1.0, 0.5, 0.0 ) ), vec3( 0.0, 0.5, 1.0 ), 0.000001 ) );

  asset( results, 70, pow2( 2.0 ) == 4.0 );
  asset( results, 71, pow2( -2.0 ) == 4.0 );

  asset( results, 80, pow3( 2.0 ) == 8.0 );
  asset( results, 81, pow3( -2.0 ) == -8.0 );

  asset( results, 90, pow4( 2.0 ) == 16.0 );
  asset( results, 91, pow4( -2.0 ) == 16.0 );

  asset( results, 100, eqAbs( average( vec3( -2.0 ) ), -2.0, 0.000001 ) );
  asset( results, 101, eqAbs( average( vec3( 10., 20., 30. ) ), 20., 0.000001 ) );

  float divisor = 0.;
  asset( results, 110, ! isinf( 0. / 1. ) );
  asset( results, 112, isinf( 1. / divisor ) );

  asset( results, 120, isnan( sqrt( 0. ) ) );
  asset( results, 122, isnan( atan( 0. ) ) );

  // should be undefined according to spec: https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/atan.xhtml
  asset( results, 126, atan( 1., 0. ) == PI_HALF );

}
