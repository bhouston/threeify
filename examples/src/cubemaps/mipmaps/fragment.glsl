precision highp float;

in vec3 v_viewPosition;
in vec3 v_viewNormal;
in vec3 v_localNormal;

uniform samplerCube iblWorldMap;
uniform float perceptualRoughness;
uniform int iblMipCount;

out vec4 outputColor;

void main() {
  vec3 localDirection = v_localNormal; //reflect( normalize( v_viewPosition ),normalize(v_viewNormal) );
  float lod = clamp(
    perceptualRoughness * float(iblMipCount),
    0.0,
    float(mipCount)
  );
  outputColor = texture(iblWorldMap, localDirection, lod);

}
