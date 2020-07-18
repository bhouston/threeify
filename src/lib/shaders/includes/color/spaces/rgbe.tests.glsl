#pragma include <unit/fragment>
#pragma include "rgbe"

void testEquivalency( inout TestResults results, in int testId, in vec4 rgbe ) {
  vec4 linear = rgbeToLinear( rgbe );
  vec4 rgbe2 = linearToRGBE( linear );
  vec4 linear2 = rgbeToLinear( rgbe2 );
  asset( results, testId, equalsTolerance( rgbe, rgbe2, 0.0001 ) );
}

void tests( inout TestResults results ) {

  testEquivalency( results, 3, vec4( 0.) );
  testEquivalency( results, 4, vec4( 0.1) );
  testEquivalency( results, 5, vec4( 0.2) );
  testEquivalency( results, 6, vec4( 0.3) );
  testEquivalency( results, 7, vec4( 0.4) );
  testEquivalency( results, 8, vec4( 0.5) );

}
