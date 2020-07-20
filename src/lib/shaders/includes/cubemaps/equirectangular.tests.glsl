#pragma include <unit/fragment>
#pragma include "equirectangular"

void testEquivalency( inout TestResults results, in int testId, in vec3 dir ) {
  vec2 uv = directionToEquirectangularUV( dir );
  vec3 dir2 = equirectangularUvToDirection( uv );
  vec2 uv2 = directionToEquirectangularUV( dir2 );
  asset( results, testId, eqAbs( dir, dir2, 0.00001 ) );
  asset( results, testId+1, eqAbs( uv, uv2, 0.00001 ) );
}

void tests( inout TestResults results ) {

  asset( results, 10, eqAbs( directionToEquirectangularUV( vec3( -1, 0, 0 ) ), vec2( 0.25, 0.5 ), 0.00001 ) );
  asset( results, 11, eqAbs( directionToEquirectangularUV( vec3( 0, 0, -1 ) ), vec2( 0.5, 0.5 ), 0.00001 ) );
  asset( results, 12, eqAbs( directionToEquirectangularUV( vec3( 1, 0, 0 ) ), vec2( 0.75, 0.5 ), 0.00001 ) );
  asset( results, 13, eqAbs( directionToEquirectangularUV( vec3( 0, 0, 1 ) ), vec2( 0.0, 0.5 ), 0.00001 ) );


  asset( results, 10, eqAbs( equirectangularUvToDirection( vec2( 0.5, 0.5 ) ), vec3( 0.0, 0.0, -1.0 ), 0.00001 ) );
  asset( results, 11, eqAbs( equirectangularUvToDirection( vec2( 0.0, 0.5 ) ), vec3( 0.0, 0.0, 1.0 ), 0.00001 ) );
  asset( results, 12, eqAbs( equirectangularUvToDirection( vec2( 1.0, 0.5 ) ), vec3( 0.0, 0.0, 1.0 ), 0.00001 ) );
  asset( results, 13, eqAbs( equirectangularUvToDirection( vec2( 0.5, 0.0 ) ), vec3( 0.0, 1.0, 0.0 ), 0.00001 ) );
  asset( results, 14, eqAbs( equirectangularUvToDirection( vec2( 0.5, 1.0 ) ), vec3( 0.0, -1.0, 0.0 ), 0.00001 ) );
  asset( results, 15, eqAbs( equirectangularUvToDirection( vec2( 0.25, 0.5 ) ), vec3( -1.0, 0.0, 0.0 ), 0.00001 ) );
  asset( results, 16, eqAbs( equirectangularUvToDirection( vec2( 0.75, 0.5 ) ), vec3( 1.0, 0.0, 0.0 ), 0.00001 ) );

  testEquivalency( results, 20, vec3( 0., 0., 1. ) );
  testEquivalency( results, 30, vec3( 0., 0., -1. ) );
  testEquivalency( results, 40, normalize( vec3( 1., 1., 1. ) ) );
  testEquivalency( results, 50, normalize( vec3( 1., -1., 1. ) ) );
  testEquivalency( results, 60, vec3( 1., 0., 0. ) );
  testEquivalency( results, 70, vec3( -1., 0., 0. ) );
  testEquivalency( results, 80, normalize( vec3( -1., 1., 1. ) ) );
  testEquivalency( results, 90, normalize( vec3( -1., -1., 1. ) ) );
  testEquivalency( results, 110, normalize( vec3( -1., 1., -1. ) ) );
  testEquivalency( results, 120, normalize( vec3( -1., -1., -1. ) ) );
  testEquivalency( results, 130, normalize( vec3( 1., 1., -1. ) ) );
  testEquivalency( results, 140, normalize( vec3( 1., -1., -1. ) ) );

}
