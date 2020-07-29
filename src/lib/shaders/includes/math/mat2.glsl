#pragma once

mat2 mat2Identity() {
  return mat2( 1., 0., 0., 1. );
}

mat2 mat2RotateDirection( vec2 dir ){
  return mat2( dir.x, -dir.y, dir.y, dir.x );
}

// validated - this is the same as the TS makeMatrix3RotationFromAngle
mat2 mat2Rotate(float angle){
  return mat2RotateDirection( vec2( cos(angle), sin(angle) ) );
}

// validated - this is the same as the TS makeMatrix3Scale
mat2 mat2Scale(vec2 scale){
  return mat2( scale.x, 0., scale.y, 0 );
}
