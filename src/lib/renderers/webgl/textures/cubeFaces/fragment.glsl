precision highp float;

varying vec3 v_position;
varying vec2 v_uv;

uniform sampler2D map;
uniform int faceIndex;

#pragma include <cubemaps/cubeFaces>
#pragma include <cubemaps/equirectangular>

void main() {

  vec3 direction = cubeFaceUVToDirection( faceIndex, v_uv );
  vec2 equirectangularUv = directionToEquirectangularUV( direction );

  gl_FragColor = texture2D( map, equirectangularUv );

}
