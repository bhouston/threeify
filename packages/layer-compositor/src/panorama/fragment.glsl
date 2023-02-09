precision highp float;

uniform sampler2D layerMap;

uniform float mipmapBias;
uniform int convertToPremultipliedAlpha;

varying vec2 v_uv;

void main() {
  vec4 layerColor = texture2D(layerMap, v_uv, mipmapBias);
  // premultiply alpha as the source PNG is not premultiplied
  if (convertToPremultipliedAlpha == 1) {
    layerColor.rgb *= layerColor.a;
  }

  vec4 outputColor = layerColor;

  gl_FragColor = outputColor;

}
