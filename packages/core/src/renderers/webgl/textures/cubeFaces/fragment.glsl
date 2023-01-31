precision highp float;

in vec3 v_position;
in vec2 v_uv;

uniform sampler2D map;
uniform int faceIndex;

out vec4 outputColor;

#pragma include <cubemaps/cubeFaces>
#pragma include <cubemaps/latLong>

void main() {
  vec3 direction = cubeFaceUVToDirection(faceIndex, v_uv);
  vec2 equirectangularUv = directionToLatLongUV(direction);

  outputColor = texture(map, equirectangularUv);
  outputColor.r = 1.0;

}
