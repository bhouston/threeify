
// See LayerMaskMode in Layer.ts for a list of enum values
float getMaskValue( vec4 maskTexel ){

  if( maskMode < 3 ) {
    if    ( maskMode == 1 )   return maskTexel.a;
    else /* maskMode == 2 */  return maskTexel.r;
  } else {
    if    ( maskMode == 3 )   return 1.0 - maskTexel.a;
    else /* maskMode == 4 */  return 1.0 - maskTexel.r;
  }
}
