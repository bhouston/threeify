precision highp float;

varying vec2 v_uv;
varying vec3 v_position;

uniform sampler2D map;
uniform int faceIndex;

#pragma include <cubemaps/uvToFaces>
#pragma include <cubemaps/equirectangular>

void main() {

  vec3 direction = cubeFaceUVToDirection( faceIndex, v_position.xy );
  vec2 equirectangularUv = directionToEquirectangularUV( direction );

  gl_FragColor = texture2D( map, equirectangularUv );

}
