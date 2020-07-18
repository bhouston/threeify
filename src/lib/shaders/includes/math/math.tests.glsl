#pragma include <unit/fragment>
#pragma include "math"

void tests( inout TestResults results ) {

  asset( results, 1, pow2( 2.0 ) == 4.0 );
  asset( results, 2, pow3( 2.0 ) == 8.0 );
  asset( results, 3, pow4( 2.0 ) == 16.0 );

  asset( results, 4, pow2( -2.0 ) == 4.0 );
  asset( results, 5, pow3( -2.0 ) == -8.0 );
  asset( results, 6, pow4( -2.0 ) == 16.0 );

  asset( results, 7, average( vec3( -2.0 ) ) == -2.0 );
  asset( results, 8, average( vec3( 10., 20., 30. ) ) == 20. );
  asset( results, 9, isnan( 1. / 0. ) );
  asset( results, 10, ! isnan( 0. / 1. ) );

  asset( results, 12, saturate( -2.) == 0. );
  asset( results, 13, saturate( 2.) == 1. );

  asset( results, 15, cos( PI ) == 1. );
  asset( results, 16, cos( PI2 ) == 0. );

}
