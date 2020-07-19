#pragma include <unit/fragment>
#pragma include "rgbe"

void testEquivalency( inout TestResults results, in int testId, in vec3 linear ) {
  vec4 rgbe = linearToRGBE( linear );
  vec3 linear2 = rgbeToLinear( rgbe );
  asset( results, testId, equalsRelativeTolerance( linear, linear2, 0.01 ) );
}

void tests( inout TestResults results ) {

  testEquivalency( results, 1, vec3( 0.0001, 0.001, 0.01 ) );
  testEquivalency( results, 2, vec3( 0.001 ) );
  testEquivalency( results, 3, vec3( 0.01 ) );
  testEquivalency( results, 4, vec3( 0.1, 1.0, 10.0 ) );
  testEquivalency( results, 5, vec3( 1.0 ) );
  testEquivalency( results, 6, vec3( 10.0 ) );
  testEquivalency( results, 7, vec3( 100.0 ) );
  testEquivalency( results, 8, vec3( 1000.0, 100.0, 10.0 ) );

}
