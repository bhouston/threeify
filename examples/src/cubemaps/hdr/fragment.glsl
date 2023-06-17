precision highp float;

in vec3 v_viewPosition;
in vec3 v_viewNormal;

uniform samplerCube cubeMap;
uniform float perceptualRoughness;
uniform int mipCount;

out vec4 outputColor;

#pragma import "@threeify/core/src/shaders/color/encodings/rgbd.glsl"

void main() {
  vec3 reflectDir = reflect(normalize(v_viewPosition), normalize(v_viewNormal));
  float lod = clamp(
    perceptualRoughness * float(mipCount),
    0.0,
    float(mipCount)
  );
  outputColor.rgb = pow(
    rgbdToLinear(texture(cubeMap, reflectDir, lod), 16.0),
    vec3(0.5)
  );

  outputColor.a = 1.0;

}
