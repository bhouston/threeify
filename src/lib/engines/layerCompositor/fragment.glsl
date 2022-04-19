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
  // premultiply alpha as the source PNG is not premultiplied
  if( convertToPremultipliedAlpha == 1 ) {
    layerColor.rgb *= layerColor.a;
  }

  vec4 outputColor = layerColor;

  if( maskMode != 0 ){

    // Check if we're in the [ 0.0, 1.0 ] UV range for masking. Otherwise, we'll get clamping artifacts.
    vec2 gt0 = step( 0., v_mask_uv );
    vec2 lt1 = 1.0 - step( 1., v_mask_uv );
    bool isMasked = dot( gt0, lt1 ) == 2.0;

    if( isMasked ) {

      vec4 maskColor = texture2D( maskMap, v_mask_uv, mipmapBias );
      // premultiply alpha as the source PNG is not premultiplied
      if( convertToPremultipliedAlpha == 1 ) {
        maskColor.rgb *= maskColor.a;
      }

      outputColor *= getMaskValue( maskColor );
    }
  }

  if( blendMode != 0){
    vec4 imageColor = texture2D( imageMap, v_image_uv, mipmapBias );

    // Image always comes from premultiplied backbuffer

    outputColor = compositeColors( outputColor, imageColor );
  }

  gl_FragColor = outputColor;

}
