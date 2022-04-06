precision highp float;

uniform sampler2D imageMap;
uniform sampler2D layerMap;
uniform sampler2D maskMap;

uniform float mipmapBias;
uniform int convertToPremultipliedAlpha;

uniform int maskMode;
uniform int blendMode;

#pragma include "./mask.frag"
#pragma include "./blend.frag"

varying vec2 v_image_uv;
varying vec2 v_layer_uv;
varying vec2 v_mask_uv;

void main() {

  vec4 layerColor = texture2D( layerMap, v_layer_uv, mipmapBias );
  vec4 outputColor = layerColor;

  if( maskMode != 0){
    vec4 maskColor = texture2D( maskMap, v_mask_uv, mipmapBias );
    outputColor *= getMaskValue( maskColor );
  }

  if( blendMode != 0){
    vec4 imageColor = texture2D( imageMap, v_image_uv, mipmapBias );
    outputColor = compositeColors( outputColor, imageColor );
  }

  // premultiply alpha in output as the source PNG is not premultiplied
  if( convertToPremultipliedAlpha == 1 ) {
    outputColor.rgb *= outputColor.a;
  }

  gl_FragColor = outputColor;

}
