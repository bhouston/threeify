#pragma include "./LCh.glsl"

uniform int blendMode;

vec4 compositeColors(vec4 src, vec4 dst){

  vec3 Sc = src.rgb;
  vec3 Dc = dst.rgb;
  float Sa = src.a;
  float ISa = 1.0 - Sa;
  float Da = dst.a;
  float IDa = 1.0 - Da;

  // Clear
  if( blendMode == 0){
    return vec4(0.);
  }
  // Src
  if( blendMode == 1){
    return vec4(src);
  }
  // Dst
  if( blendMode == 2){
    return vec4(dst);
  }
  // SrcOver
  if( blendMode == 3){
    return vec4(
      Sc + Dc*ISa,
      Sa + Da*ISa
    );
  }
  // DstOver
  if( blendMode == 4){
    return vec4(
      Dc + Sc*IDa,
      Da + Sa*IDa
    );
  }
  // SrcIn
  if( blendMode == 5){
    return vec4(
      Sc*Da,
      Sa*Da
    );
  }
  // DstIn
  if( blendMode == 6){
    return vec4(
      Dc*Sa,
      Sa*Da
    );
  }
  // SrcOut
  if( blendMode == 7){
    return vec4(
      Sc*IDa,
      Sa*IDa
    );
  }
   // DstOut
  if( blendMode == 8){
    return vec4(
      Dc*ISa,
      Da*ISa
    );
  }
  // SrcAtop
  if( blendMode == 9 ){
    return vec4(
      Sc*Da + Dc*ISa,
      Da
    );
  }
  // DstAtop
  if( blendMode == 10 ){
    return vec4(
      Dc*Sa + Sc*IDa,
      Sa
    );
  }
  // Xor
  if( blendMode == 11 ){
    return vec4(
      Sc * IDa + Dc*ISa,
      Sa * IDa + Da * ISa
    );
  }
  // Add
  if( blendMode == 12 ){
    return vec4(
      Sc+Dc,
      Sa+Da
    );
  }
  // Multiply (Matching Html Canvas and Photoshop)
  if( blendMode == 13 ){
    return vec4(
      IDa * Sc + ISa * Dc + Sc * Dc,
      IDa * Sa + ISa * Da + Sa * Da
    );
  }
  // Screen
  if( blendMode == 14 ){
    return vec4(
      1.0 - (1.0 - Sc) * (1.0 - Dc),
      1.0 - ISa * IDa
    );
  }
  // Overlay
  if( blendMode == 15 ){
    vec3 edge = step( Da * 0.5, Dc );
    vec3 mul = IDa * Sc + ISa * Dc + 2.0 * Sc * Dc;
    vec3 screen = Sa * Da - 2.0 * (Da - Sc)* (Sa -Dc);

    return vec4(
      mix(mul, screen, edge),
      Sa + Da - Sa * Da
    );
  }
  // Ligthen
  if( blendMode == 16 ){
    return vec4(
      IDa * Sc + ISa * Dc + max(Sc, Dc),
      Sa + ISa * Da
    );
  }
  // Darken
  if( blendMode == 17 ){
    return vec4(
      IDa * Sc + ISa * Dc + min(Sc, Dc),
      Sa + ISa * Da
    );
  }

  // Hue (Hue from src, Chroma/Luma from dst)
  if( blendMode == 24 ){ // Double check with inverse
    vec3 new = mixLCH( Sa * Dc, Dc, Sc );
    return vec4(
      IDa * Sc + ISa * Dc + new,
      Sa + ISa * Da
    );
  }

  // Saturation (Chroma from src, Hue/Luma from dst)
  if( blendMode == 25 ){
    vec3 new = mixLCH( Sa * Dc, Sc, Dc );
    return vec4(
      IDa * Sc + ISa * Dc + new,
      Sa + ISa * Da
    );
  }

  // Color ( Hue/Chroma from src, Luma from dst)
  if( blendMode == 26 ){
    vec3 new = mixLCHFast( Sa * Dc, Sc );
    return vec4(
      IDa * Sc + ISa * Dc + new,
      Sa + ISa * Da
    );
  }

  // Luminosity ( Luma from src, Hue/Chroma from dst )
  if( blendMode == 27 ){
    vec3 new = mixLCHFast( Da * Sc, Dc );
    return vec4(
      IDa * Sc + ISa * Dc + new,
      Sa + ISa * Da
    );
  }

  return vec4(0.);
}
