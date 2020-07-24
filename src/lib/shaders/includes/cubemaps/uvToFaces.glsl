#pragma once

// reference: https://github.com/tmarrinan/cube2equirect
void directionToCubeFaceUV( vec3 dir, out int face, out vec2 uv ) {

  vec3 temp;
  if (abs(dir.x) >= abs(dir.y) && abs(dir.x) >= abs(dir.z)) {
		if (dir.x < 0.0) {
      temp = vec3( dir.z, dir.y, -dir.x );
      face = 1; // left
		}
		else {
      temp = vec3( -dir.z, dir.y, dir.x );
      face = 0; // right
		}
	}
	else if (abs(dir.y) >= abs(dir.z)) {
		if (dir.y < 0.0) {
      temp = vec3( dir.x, dir.z, -dir.y );
      face = 2; // top
		}
		else {
      temp = vec3( dir.x, -dir.z, dir.y );
      face = 3; // bottom
		}
	}
	else {
		if (dir.z < 0.0) {
      temp = vec3( dir.x, -dir.y, dir.z );
      face = 4; // back
		}
		else {
      temp = vec3( dir.x, dir.y, dir.z );
      face = 5; // front
		}
	}

  uv = temp.xy * ( 0.5 / temp.z ) + 0.5;
}


vec3 cubeFaceUVToDirection(int face, vec2 uv) {
  vec3 result;

	if(face == 0) {
		result = vec3( 1., -uv.y, -uv.x );
  }
  else if(face == 1) {
		result = vec3( -1., -uv.y, uv.x );
  }
  else if(face == 2) {
		result =vec3( uv.x, 1., uv.y );
  }
	else if(face == 3) {
		result =vec3( uv.x, -1., -uv.y );
  }
	else if(face == 4) {
		result = vec3( uv.x, -uv.y, 1. );
  }
	else  {
		result = vec3( -uv.x, -uv.y, -1. );
  }

  return normalize( result );
}
