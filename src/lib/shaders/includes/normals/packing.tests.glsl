#pragma include <unit/fragment>
#pragma include "packing"

void testEquivalency( inout TestResults results, in int testId, in vec3 normal ) {
  vec3 rgb = normalToRgb( normal );
  vec3 normal2 = rgbToNormal( rgb );
  assert( results, testId, eqAbs( normal, normal2, 0.0001 ) );
}

void tests( inout TestResults results ) {

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
