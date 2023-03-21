precision highp float;

in vec3 v_viewPosition;
in vec3 v_viewNormal;

uniform samplerCube iblWorldMap;
uniform int iblMipCount;
uniform float perceptualRoughness;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/encodings/rgbd.glsl"

void main() {
  vec3 reflectDir = reflect(normalize(v_viewPosition), normalize(v_viewNormal));
  float lod = clamp(
    perceptualRoughness * float(iblMipCount),
    0.0,
    float(iblMipCount)
  );
  outputColor.rgb = pow(
    rgbdToLinear(texture(iblWorldMap, reflectDir, lod), 16.0),
    vec3(0.5)
  );

  outputColor.a = 1.0;

}
