#pragma include <unit/fragment>
#pragma include <cubemaps/equirectangular>

void testEquivalency( inout TestResults results, in int testId, in vec3 dir ) {
  vec2 uv = directionToEquirectangularUV( dir );
  vec3 dir2 = equirectangularUvToDirection( uv );
  asset( results, testId, dir == dir2 );
}

void test( inout TestResults results ) {

  vec3 px = vec3( 1., 0., 0. );
  vec3 py = vec3( 0., 1., 0. );
  vec3 pz = vec3( 0., 0., 1. );

  testEquivalency( results, 3, px );
  testEquivalency( results, 4, -px );
  testEquivalency( results, 5, py );
  testEquivalency( results, 6, -py );
  testEquivalency( results, 7, pz );
  testEquivalency( results, 8, -pz );
}
