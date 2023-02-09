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
  vec4 layerColor = texture2D(layerMap, v_layer_uv, mipmapBias);
  // premultiply alpha as the source PNG is not premultiplied
  if (convertToPremultipliedAlpha == 1) {
    layerColor.rgb *= layerColor.a;
  }

  vec4 outputColor = layerColor;

  if (maskMode != 0) {
    // Check if we're in the [ 0., 1. ] UV range for masking. Otherwise, we'll get clamping artifacts.
    const vec2 lowerBound = vec2(0.);
    const vec2 upperBound = vec2(1.);

    // Check ( v >= lower && v <= upper). Rework into (v >= lower && -v >= -upper), which combines to (v,-v) >= (lower, -upper)
    const vec4 comboBounds = vec4(lowerBound, -upperBound);
    vec4 comboValue = vec4(v_mask_uv, -v_mask_uv);
    bvec4 inBounds = greaterThanEqual(comboValue, comboBounds);
    bool hasMaskData = all(inBounds);

    vec4 maskColor = hasMaskData
      ? texture2D(maskMap, v_mask_uv, mipmapBias)
      : vec4(0.);

    // premultiply alpha as the source PNG is not premultiplied
    if (convertToPremultipliedAlpha == 1) {
      maskColor.rgb *= maskColor.a;
    }

    outputColor *= getMaskValue(maskColor);

  }

  if (blendMode != 0) {
    vec4 imageColor = texture2D(imageMap, v_image_uv, mipmapBias);

    // Image always comes from premultiplied backbuffer

    outputColor = compositeColors(outputColor, imageColor);
  }

  gl_FragColor = outputColor;

}
