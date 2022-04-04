precision highp float;

uniform sampler2D layerMap;
uniform sampler2D maskMap;
uniform float mipmapBias;
uniform int convertToPremultipliedAlpha;

uniform vec2 layerUVScale;

uniform mat3 uvToTexture;
uniform mat3 uvToMaskTexture;

uniform mat3 uvToImage;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

uniform vec2 imgSize;
uniform vec2 layerSize;
uniform vec2 layerPos;
uniform sampler2D imgMap;

#pragma include <math/math>
#pragma include <color/spaces/srgb>

#pragma include "./mask.frag"
#pragma include "./blend.frag"

void main() {

  vec2 imgUv = (( vec2( v_uv.x, 1.0-v_uv.y ) * layerSize + layerPos) / imgSize );
  imgUv = ( uvToTexture * vec3( imgUv, 1.0 ) ).xy;

  vec4 imgColor = texture2D( imgMap, imgUv, mipmapBias );

  vec2 layerUv = ( uvToTexture * vec3( v_uv, 1.0 ) ).xy;
  vec4 layerColor = texture2D( layerMap, layerUv, mipmapBias );

  vec2 maskTexelUv = ( uvToMaskTexture * vec3( v_uv, 1.0 ) ).xy;
  vec4 maskTexel = texture2D( maskMap, maskTexelUv, mipmapBias );
  layerColor *= getMaskValue(maskTexel);

  vec4 outputColor = compositeColors( layerColor, imgColor);

  // premultiply alpha in output as the source PNG is not premultiplied
  if( convertToPremultipliedAlpha == 1 ) {
    outputColor.rgb *= outputColor.a;
  }

  gl_FragColor = outputColor;

}
