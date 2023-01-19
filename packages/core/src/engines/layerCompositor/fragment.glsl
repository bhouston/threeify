precision highp float;

uniform sampler2D layerMap;
uniform float mipmapBias;
uniform int convertToPremultipliedAlpha;

uniform vec2 layerUVScale;

uniform mat3 uvToTexture;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

#pragma include <math/math>
#pragma include <color/spaces/srgb>

void main() {
  vec3 outputColor = vec3(0.0);
  vec2 texelUv = (uvToTexture * vec3(v_uv, 1.0)).xy;

  vec4 layerColor = texture(layerMap, texelUv, mipmapBias);

  // premultiply alpha in output as the source PNG is not premultiplied
  if (convertToPremultipliedAlpha == 1) {
    layerColor.rgb *= layerColor.a;
  }
  gl_FragColor = layerColor;

}
