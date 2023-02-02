precision highp float;

in vec2 v_uv0;

uniform sampler2D map;
uniform int faceIndex;

out vec4 outputColor;

#pragma include <cubemaps/cubeFaces>
#pragma include <cubemaps/latLong>

void main() {
  vec3 direction = cubeFaceUVToDirection(faceIndex, v_uv0);
  vec2 equirectangularUv = directionToLatLongUV(direction);

  outputColor = texture(map, equirectangularUv);

}
