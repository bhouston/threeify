#pragma include <tests/fragment>
#pragma include "srgb"

void testEquivalency( inout TestSuite suite, in int testId, in vec3 srgb ) {
  vec3 linear = sRGBToLinear( srgb );
  vec3 srgb2 = linearTosRGB( linear );
  assert( suite, testId, eqAbs( srgb, srgb2, 0.0001 ) );
}

void tests( inout TestSuite suite ) {

  testEquivalency( suite, 3, vec3( 0.) );
  testEquivalency( suite, 4, vec3( 0.1) );
  testEquivalency( suite, 5, vec3( 0.2) );
  testEquivalency( suite, 6, vec3( 0.3) );
  testEquivalency( suite, 7, vec3( 0.4) );
  testEquivalency( suite, 8, vec3( 0.5) );

}
