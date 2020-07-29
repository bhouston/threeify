#pragma once

mat2 mat2Identity() {
  return mat2( 1., 0., 0., 1. );
}

// https://thebookofshaders.com/08/
mat2 mat2Rotate(float angle){
  float c = cos(angle);
  float s = sin(angle);

  return mat2( c, -s, s, c );
}
