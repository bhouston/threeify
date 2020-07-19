#pragma include <unit/fragment>
#pragma include "math"

void tests( inout TestResults results ) {

  asset( results, 1, pow2( 2.0 ) == 4.0 );
  asset( results, 2, pow3( 2.0 ) == 8.0 );
  asset( results, 3, pow4( 2.0 ) == 16.0 );

  asset( results, 4, pow2( -2.0 ) == 4.0 );
  asset( results, 5, pow3( -2.0 ) == -8.0 );
  asset( results, 6, pow4( -2.0 ) == 16.0 );

  asset( results, 7, equalsTolerance( average( vec3( -2.0 ) ), -2.0, 0.000001 ) );
  asset( results, 8, equalsTolerance( average( vec3( 10., 20., 30. ) ), 20., 0.000001 ) );
  float divisor = 0.;
  asset( results, 9, ! isnan( 0. / 1. ) );
  asset( results, 10, isnan( 1. / divisor ) );
  asset( results, 11, isnan( sqrt( divisor ) ) );

  asset( results, 12, equalsTolerance( saturate( -2.), 0., 0.000001 ) );
  asset( results, 13, equalsTolerance( saturate( 2.), 1., 0.000001 ) );

  asset( results, 15, equalsTolerance( cos( PI ), -1., 0.000001 ) );
  asset( results, 16, equalsTolerance( cos( PI2 ), 1., 0.000001 ) );

  asset( results, 17, equalsTolerance( sin( PI ), 0., 0.000001 ) );
  asset( results, 18, equalsTolerance( sin( PI2 ), 0., 0.000001 ) );

}
