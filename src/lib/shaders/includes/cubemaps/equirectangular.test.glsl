#pragma include <tests/fragment>
#pragma include "equirectangular"

void testEquivalency( inout TestSuite suite, in int testId, in vec3 dir ) {
  vec2 uv = directionToEquirectangularUV( dir );
  vec3 dir2 = equirectangularUvToDirection( uv );
  vec2 uv2 = directionToEquirectangularUV( dir2 );
  assert( suite, testId, eqAbs( dir, dir2, 0.00001 ) );
  assert( suite, testId+1, eqAbs( uv, uv2, 0.00001 ) );
}

void tests( inout TestSuite suite ) {

  assert( suite, 0, eqAbs( directionToEquirectangularUV( vec3( -1, 0, 0 ) ), vec2( 0.25, 0.5 ), 0.00001 ) );
  assert( suite, 1, eqAbs( directionToEquirectangularUV( vec3( 0, 0, -1 ) ), vec2( 0.5, 0.5 ), 0.00001 ) );
  assert( suite, 2, eqAbs( directionToEquirectangularUV( vec3( 1, 0, 0 ) ), vec2( 0.75, 0.5 ), 0.00001 ) );
  assert( suite, 3, eqAbs( directionToEquirectangularUV( vec3( 0, 0, 1 ) ), vec2( 0.0, 0.5 ), 0.00001 ) );

  assert( suite, 10, eqAbs( equirectangularUvToDirection( vec2( 0.5, 0.5 ) ), vec3( 0.0, 0.0, -1.0 ), 0.00001 ) );
  assert( suite, 11, eqAbs( equirectangularUvToDirection( vec2( 0.0, 0.5 ) ), vec3( 0.0, 0.0, 1.0 ), 0.00001 ) );
  assert( suite, 12, eqAbs( equirectangularUvToDirection( vec2( 1.0, 0.5 ) ), vec3( 0.0, 0.0, 1.0 ), 0.00001 ) );
  assert( suite, 13, eqAbs( equirectangularUvToDirection( vec2( 0.5, 0.0 ) ), vec3( 0.0, 1.0, 0.0 ), 0.00001 ) );
  assert( suite, 14, eqAbs( equirectangularUvToDirection( vec2( 0.5, 1.0 ) ), vec3( 0.0, -1.0, 0.0 ), 0.00001 ) );
  assert( suite, 15, eqAbs( equirectangularUvToDirection( vec2( 0.25, 0.5 ) ), vec3( -1.0, 0.0, 0.0 ), 0.00001 ) );
  assert( suite, 16, eqAbs( equirectangularUvToDirection( vec2( 0.75, 0.5 ) ), vec3( 1.0, 0.0, 0.0 ), 0.00001 ) );

  testEquivalency( suite, 20, vec3( 0., 0., 1. ) );
  testEquivalency( suite, 30, vec3( 0., 0., -1. ) );
  testEquivalency( suite, 40, normalize( vec3( 1., 1., 1. ) ) );
  testEquivalency( suite, 50, normalize( vec3( 1., -1., 1. ) ) );
  testEquivalency( suite, 60, vec3( 1., 0., 0. ) );
  testEquivalency( suite, 70, vec3( -1., 0., 0. ) );
  testEquivalency( suite, 80, normalize( vec3( -1., 1., 1. ) ) );
  testEquivalency( suite, 90, normalize( vec3( -1., -1., 1. ) ) );
  testEquivalency( suite, 110, normalize( vec3( -1., 1., -1. ) ) );
  testEquivalency( suite, 120, normalize( vec3( -1., -1., -1. ) ) );
  testEquivalency( suite, 130, normalize( vec3( 1., 1., -1. ) ) );
  testEquivalency( suite, 140, normalize( vec3( 1., -1., -1. ) ) );

}
