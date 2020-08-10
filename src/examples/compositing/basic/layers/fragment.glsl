precision highp float;

uniform sampler2D layerMap;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

#pragma include <color/spaces/srgb>

void main() {
  vec3 outputColor = vec3(0.);
  outputColor += sRGBToLinear( texture2D( layerMap, v_uv ).rgb );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  gl_FragColor.a = 1.0;

}
