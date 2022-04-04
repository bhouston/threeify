precision highp float;

uniform sampler2D layerMap;
uniform sampler2D maskMap;
uniform float mipmapBias;
uniform int convertToPremultipliedAlpha;

uniform vec2 layerUVScale;

uniform mat3 uvToTexture;
uniform mat3 uvToMaskTexture;

uniform mat3 uvToImage;

uniform int maskMode;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

uniform vec2 imgSize;
uniform vec2 layerSize;
uniform vec2 layerPos;
uniform sampler2D imgMap;

uniform int blendMode;

#pragma include <math/math>
#pragma include <color/spaces/srgb>

float getMaskValue(){

  if( maskMode == 0 ) return 1.0;

  vec2 maskTexelUv = ( uvToMaskTexture * vec3( v_uv, 1.0 ) ).xy;
  vec4 maskTexel = texture2D( maskMap, maskTexelUv, mipmapBias );

  float maskValue;

  if ( maskMode == 1 ) return maskTexel.a;
  if ( maskMode == 2 ) return maskTexel.r;
  if ( maskMode == 3 ) return 1.0 - maskTexel.a;
  if ( maskMode == 4 ) return 1.0 - maskTexel.r;

  return 1.0;

}


// According to https://www.w3.org/TR/compositing-1/#blendingnonseparable
const vec3 lumaCoef = vec3( 0.3, 0.59, 0.11 );

float minComponent( vec3 color ){
  return min( color.r, min( color.g, color.b ) );
}

float maxComponent( vec3 color ){
  return max( color.r, max( color.g, color.b ) );
}

float getLuma( vec3 color ){
  return dot( color, lumaCoef );
}

float getChroma( vec3 color ){
  return maxComponent( color ) - minComponent( color );
}

vec3 _withChroma( vec3 color,  float chroma ){

  float min = minComponent( color );
  float max = maxComponent( color );

  if( min >= max ){
    // Gray Color
    return vec3( 0. );
  }

  float curChroma = getChroma( color );

  vec3 withSat = (color - min) * chroma / curChroma;
  return withSat;
}

vec3 _withLuma( vec3 color, float luma){

  float curLuma = getLuma(color);
  float dLuma = luma - curLuma;

  // This works because lumaCoef sums to 1.0
  vec3 withLuma = color + dLuma;

  float min = minComponent( withLuma );
  float max = maxComponent( withLuma );

  vec3 corrected;
  if( min < 0.0 ) {
    corrected = ( withLuma - luma ) * luma / ( luma - min ) + luma;
  } else if ( max > 1.0 ) {
    corrected = ( withLuma - luma ) * ( 1.0 - luma ) / ( max - luma ) + luma;
  } else {
    corrected = withLuma;
  }

  return corrected;

}

vec3 mixLCH( vec3 lumaColor, vec3 chromaColor, vec3 hueColor ){

  float targetChroma = getChroma( chromaColor );
  float targetLuma = getLuma( lumaColor );

  vec3 withChromaHue = _withChroma( hueColor, targetChroma );
  vec3 withLumaChromaHue = _withLuma( withChromaHue, targetLuma );

  return withLumaChromaHue;

}

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
    vec3 new = mixLCH( Sa * Dc, Sc, Sc );
    return vec4(
      IDa * Sc + ISa * Dc + new,
      Sa + ISa * Da
    );
  }

  // Luminosity ( Luma from src, Hue/Chroma from dst )
  if( blendMode == 27 ){
    vec3 new = mixLCH( Da * Sc, Dc, Dc );
    return vec4(
      IDa * Sc + ISa * Dc + new,
      Sa + ISa * Da
    );
  }

  return vec4(0.);
}

void main() {

  vec2 imgUv = (( vec2( v_uv.x, 1.0-v_uv.y ) * layerSize + layerPos) / imgSize );
  imgUv = ( uvToTexture * vec3( imgUv, 1.0 ) ).xy;

  vec4 imgColor = texture2D( imgMap, imgUv, mipmapBias );

  vec2 texelUv = ( uvToTexture * vec3( v_uv, 1.0 ) ).xy;

  vec4 layerColor = texture2D( layerMap, texelUv, mipmapBias );

  layerColor *= getMaskValue();

  vec4 outputColor = compositeColors( layerColor, imgColor);

  // premultiply alpha in output as the source PNG is not premultiplied
  if( convertToPremultipliedAlpha == 1 ) {
    outputColor.rgb *= outputColor.a;
  }

  gl_FragColor = outputColor;

}
