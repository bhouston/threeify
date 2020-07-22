#pragma include <unit/fragment>
#pragma include "srgb"

void testEquivalency( inout TestResults results, in int testId, in vec3 srgb ) {
  vec3 linear = sRGBToLinear( srgb );
  vec3 srgb2 = linearTosRGB( linear );
  assert( results, testId, eqAbs( srgb, srgb2, 0.0001 ) );
}

void tests( inout TestResults results ) {

  testEquivalency( results, 3, vec3( 0.) );
  testEquivalency( results, 4, vec3( 0.1) );
  testEquivalency( results, 5, vec3( 0.2) );
  testEquivalency( results, 6, vec3( 0.3) );
  testEquivalency( results, 7, vec3( 0.4) );
  testEquivalency( results, 8, vec3( 0.5) );

}
