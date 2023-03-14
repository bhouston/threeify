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

  if (blendMode < 24) {
    if (blendMode < 16) {
      // Multiply (Matching Html Canvas and Photoshop)
      if (blendMode == 13) blend = Sc * Dc;
      else // Screen (Matching Html Canvas and Photoshop)
      if (blendMode == 14) blend = 1.0 - (1.0 - Sc) * (1.0 - Dc);
      else // Overlay (Matching Html Canvas and Photoshop)
      /* blendMode == 15 */
      {
        vec3 edge = step(0.5, Dc);
        vec3 mul = Sc * Dc;
        vec3 screen = 0.5 - (1.0 - Sc) * (1.0 - Dc);
        blend = 2.0 * mix(mul, screen, edge);
      }
    } else {
      // Ligthen
      if (blendMode == 16) blend = max(Sc, Dc);
      else
        // Darken
        /* blendMode == 17 */
        blend = min(Sc, Dc);
    }
  } else {
    if (blendMode < 26) {
      // Hue (Hue from src, Chroma/Luma from dst)
      if (blendMode == 24) blend = mixLCH(Dc, Dc, Sc);
      else
        // Saturation (Chroma from src, Hue/Luma from dst)
        /* blendMode == 25 */
        blend = mixLCH(Dc, Sc, Dc);
    } else {
      // Color ( Hue/Chroma from src, Luma from dst)
      if (blendMode == 26) blend = mixLCHFast(Dc, Sc);
      else
        // Luminosity ( Luma from src, Hue/Chroma from dst )
        /* blendMode == 27 */
        blend = mixLCHFast(Sc, Dc);
    }
  }

  return vec4(IDa * Sc + ISa * Dc + Sa * Da * blend, Sa + ISa * Da);
}
