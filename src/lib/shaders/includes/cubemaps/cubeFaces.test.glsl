#pragma include <tests/fragment>
#pragma include "cubeFaces"

void testDirectionToCubeFaceUV( inout TestSuite suite, in int testId, in vec3 dir, in int face, in vec2 uv ) {
  int face2;
  vec2 uv2;
  directionToCubeFaceUV( dir, face2, uv2 );
  assert( suite, testId, face2 == face );
  assert( suite, testId+1, eqAbs( uv, uv2, 0.00001 ) );

  vec3 dir3 = cubeFaceUVToDirection( face2, uv2 );
  assert( suite, testId+5, eqAbs( dir, dir3, 0.0001) );

}

void tests( inout TestSuite suite ) {

  testDirectionToCubeFaceUV( suite, 50, vec3( 1., 0., 0. ), 0, vec2( 0.5, 0.5 ) );
  testDirectionToCubeFaceUV( suite, 40, vec3( -1., 0., 0. ), 1, vec2( 0.5, 0.5 ) );
  testDirectionToCubeFaceUV( suite, 30, vec3( 0., 1., 0. ), 2, vec2( 0.5, 0.5 ) );
  testDirectionToCubeFaceUV( suite, 20, vec3( 0., -1., 0. ), 3, vec2( 0.5, 0.5 ) );
  testDirectionToCubeFaceUV( suite, 10, vec3( 0., 0., 1. ), 4, vec2( 0.5, 0.5 ) );
  testDirectionToCubeFaceUV( suite, 0, vec3( 0., 0., -1. ), 5, vec2( 0.5, 0.5 ) );

}
