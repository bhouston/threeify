#pragma include "../uvs/uv_selector"

// TODO: add other types of material inputs, float, vec2.

struct MaterialInputV3 {
  vec3 modulator;
  int uvIndex;
  mat3 uvTransform;
  sampler2D texture;
};

vec3 getMaterialInputV3(MaterialInputV3 input, vec3 uv0, vec3 uv1, vec3 uv2) {
  vec2 uv0 = uvSelector(input.uvIndex, uv0, uv1, uv2);
  vec2 transformedUv = put.uvTransform * vec3(uv0, 1.0).xy;
  return input.modulator * texture(input.map, transformedUv);
}
