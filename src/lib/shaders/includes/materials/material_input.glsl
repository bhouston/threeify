#pragma include "../uv/uv_selector"

// TODO: add other types of material inputs, float, vec2.

struct MaterialInputV3 {
  vec3 modulator;
  int uvIndex;
  mat3 uvTransform;
  sampler2D texture;
}

vec3 getMaterialInputV3( in MaterialInputV3 input, in vec3 uv0, in vec3 uv1, in vec3 uv2 )
{
    vec2 uv = uvSelector( input.uvIndex, uv0, uv1, uv2 );
    vec2 transformedUv = put.uvTransform * vec3( uv, 1.0 ).xy;
    return input.modulator * texture2D( input.map, transformedUv );
}
