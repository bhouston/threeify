precision highp float;

uniform sampler2D layerMap;
uniform sampler2D maskMap;
uniform float mipmapBias;
uniform int convertToPremultipliedAlpha;

uniform vec2 layerUVScale;

uniform mat3 uvToTexture;
uniform mat3 uvToMaskTexture;
uniform int maskMode;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

#pragma include <math/math>
#pragma include <color/spaces/srgb>

void main() {
  vec3 outputColor = vec3(0.);
  vec2 texelUv = ( uvToTexture * vec3( v_uv, 1.0 ) ).xy;

  vec4 layerColor = texture2D( layerMap, texelUv, mipmapBias );

  if ( maskMode > 0 ) {
    
    vec2 maskTexelUv = ( uvToMaskTexture * vec3( v_uv, 1.0 ) ).xy;
    vec4 maskTexel = texture2D( maskMap, maskTexelUv, mipmapBias );

    float maskValue;

    if( maskMode == 2 || maskMode == 4 ) {
      maskValue = maskTexel.r;
    } else {
      maskValue = maskTexel.a;
    }

    if( maskMode >= 3 ) {
      maskValue = 1.0 - maskValue;
    }

    layerColor *= maskValue;
  }

  // premultiply alpha in output as the source PNG is not premultiplied
  if( convertToPremultipliedAlpha == 1 ) {
    layerColor.rgb *= layerColor.a;
  }
  gl_FragColor = layerColor;

}
