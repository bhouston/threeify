uniform int maskMode;

float getMaskValue( vec4 maskTexel ){

  if( maskMode == 0 ) return 1.0;
  if ( maskMode == 1 ) return maskTexel.a;
  if ( maskMode == 2 ) return maskTexel.r;
  if ( maskMode == 3 ) return 1.0 - maskTexel.a;
  if ( maskMode == 4 ) return 1.0 - maskTexel.r;

  return 1.0;

}
