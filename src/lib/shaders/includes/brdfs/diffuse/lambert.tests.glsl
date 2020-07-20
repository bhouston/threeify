#pragma include <unit/fragment>
#include "lambert"

void tests( inout TestResults results ) {

  asset( results, 1, eqAbs( BRDF_Diffuse_Lambert( vec3( 1. ) ), vec3( RECIPROCAL_PI ), 0.0000001 ) );
  asset( results, 2, eqAbs( BRDF_Diffuse_Lambert( vec3( 0. ) ), vec3( 0 ), 0.0000001 ) );

}
