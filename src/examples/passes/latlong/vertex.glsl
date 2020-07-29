attribute vec3 position;

varying vec4 v_homogeneousVertexPosition;

void main() {

  // homogeneous vertex position
  gl_Position.xy = position.xy;
  gl_Position.z = -1.; // position at near clipping plane.  (set to 1. for far clipping plane.)
  gl_Position.w = 1.; // nortmalized

  v_homogeneousVertexPosition = gl_Position;

}
