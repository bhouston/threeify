#pragma include <unit/fragment>
#pragma include "rgbd"

void testEquivalency( inout TestResults results, in int testId, in vec3 linear, in float maxRange ) {
  vec4 rgbd = linearToRGBD( linear, maxRange );
  vec3 linear2 = rgbdToLinear( rgbd, maxRange );
  assert( results, testId, eqRel( linear, linear2, 0.01 ) );
}

void tests( inout TestResults results ) {

  testEquivalency( results, 1, vec3( 0.0001, 0.001, 0.01 ), 16. );
  testEquivalency( results, 2, vec3( 0.001 ), 16. );
  testEquivalency( results, 3, vec3( 0.01 ), 16. );
  testEquivalency( results, 4, vec3( 0.1, 1.0, 10.0 ), 16. );
  testEquivalency( results, 5, vec3( 1.0 ), 16. );
  testEquivalency( results, 6, vec3( 10.0 ), 16. );
  testEquivalency( results, 7, vec3( 100.0 ), 16. );
  testEquivalency( results, 8, vec3( 1000.0, 100.0, 10.0 ), 16. );


  testEquivalency( results, 11, vec3( 0.0001, 0.001, 0.01 ), 8. );
  testEquivalency( results, 12, vec3( 0.001 ), 128. );
  testEquivalency( results, 13, vec3( 0.01 ), 128. );
  testEquivalency( results, 14, vec3( 0.1, 1.0, 10.0 ), 32. );
  testEquivalency( results, 15, vec3( 1.0 ), 32. );
  testEquivalency( results, 16, vec3( 10.0 ), 64. );
  testEquivalency( results, 17, vec3( 100.0 ), 64. );
  testEquivalency( results, 18, vec3( 1000.0, 100.0, 10.0 ), 64. );

}
