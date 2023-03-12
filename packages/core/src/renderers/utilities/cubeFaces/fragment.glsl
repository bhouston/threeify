precision highp float;

in vec2 v_uv0;

uniform sampler2D map;
uniform int faceIndex;

out vec4 outputColor;

#pragma import "../../../shaders/cubemaps/cubeFaces.glsl"
#pragma import "../../../shaders/cubemaps/latLong.glsl"

void main() {
  vec3 direction = cubeFaceUVToDirection(faceIndex, v_uv0);
  vec2 equirectangularUv = directionToLatLongUV_2(direction);

  outputColor = texture(map, equirectangularUv);

}
