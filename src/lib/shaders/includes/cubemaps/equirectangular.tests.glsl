#pragma include <unit/fragment>
#pragma include <cubemaps/equirectangular>

void testEquivalency( inout TestResults results, in int testId, in vec3 dir ) {
  vec2 uv = directionToEquirectangularUV( dir );
  vec3 dir2 = equirectangularUvToDirection( uv );
  asset( results, testId, dir == dir2 );
}

void tests( inout TestResults results ) {

  asset( results, 10, eqAbs( directionToEquirectangularUV( vec3( -1, 0, 0 ) ), vec2( 0.25, 0.5 ), 0.00001 ) );
  asset( results, 11, eqAbs( directionToEquirectangularUV( vec3( 0, 0, -1 ) ), vec2( 0.5, 0.5 ), 0.00001 ) );
  asset( results, 12, eqAbs( directionToEquirectangularUV( vec3( 1, 0, 0 ) ), vec2( 0.75, 0.5 ), 0.00001 ) );
  asset( results, 13, eqAbs( directionToEquirectangularUV( vec3( 0, 0, 1 ) ), vec2( 0.0, 0.5 ), 0.00001 ) );

/*
  vec3 px = vec3( 1., 0., 0. );
  vec3 py = vec3( 0., 1., 0. );
  vec3 pz = vec3( 0., 0., 1. );

  testEquivalency( results, 3, px );
  testEquivalency( results, 4, -px );
  testEquivalency( results, 5, py );
  testEquivalency( results, 6, -py );
  testEquivalency( results, 7, pz );
  testEquivalency( results, 8, -pz );
*/

}
