#pragma include "./LCh.glsl"

// See LayerBlendMode in Layer.ts for a list of enum values
vec4 compositeColors(vec4 src, vec4 dst) {

  vec3 Sc = src.rgb;
  vec3 Dc = dst.rgb;
  float Sa = src.a;
  float ISa = 1.0 - Sa;
  float Da = dst.a;
  float IDa = 1.0 - Da;

  vec3 blend;

  if ( blendMode < 24 ) {
    if ( blendMode < 16 ) {
      // Multiply (Matching Html Canvas and Photoshop)
      if      ( blendMode == 13 )   blend = Sc * Dc;

      // Screen (Matching Html Canvas and Photoshop)
      else if ( blendMode == 14 )   blend = ( 1.0 - ( ( 1.0 - Sc ) * ( 1.0 - Dc ) ) );

      // Overlay (Matching Html Canvas and Photoshop)
      else   /* blendMode == 15 */ {
        vec3 edge = step( Da * 0.5, Dc );
        vec3 mul = 2.0 * Sc * Dc;
        vec3 screen = ( 1.0 - 2.0 * ( ( 1.0 - Sc ) * ( 1.0 - Dc ) ) );
        blend = mix( mul, screen, edge );
      }
    }
    else {
      // Ligthen
      if      ( blendMode == 16 )   blend = max(Sc, Dc);

      // Darken
      else   /* blendMode == 17 */  blend = min(Sc, Dc);
    }
  }
  else {
    if ( blendMode < 26 ) {
      // Hue (Hue from src, Chroma/Luma from dst)
      if      ( blendMode == 24 )   blend = mixLCH( Sa * Dc, Dc, Sc );

      // Saturation (Chroma from src, Hue/Luma from dst)
      else   /* blendMode == 25 */  blend = mixLCH( Sa * Dc, Sc, Dc );
    }
    else {

      // Color ( Hue/Chroma from src, Luma from dst)
      if      ( blendMode == 26 )   blend = mixLCHFast( Sa * Dc, Sc );

      // Luminosity ( Luma from src, Hue/Chroma from dst )
      else   /* blendMode == 27 */  blend = mixLCHFast( Da * Sc, Dc );
    }
  }

  vec3 remain = IDa * Sc + ISa * Dc;
  float overA = Sa + ISa * Da;

  return vec4( remain + blend, overA );
}
