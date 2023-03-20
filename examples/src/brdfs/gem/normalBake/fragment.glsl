precision highp float;

in vec3 v_viewSurfaceNormal;

// transforms
uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToClip;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  vec3 viewSurfaceNormal = normalize(v_viewSurfaceNormal);

  mat4 localToView = worldToView * localToWorld;
 
  vec3 localSurfaceDirection = mat4UntransformDirection( localToView, viewSurfaceNormal );

  outputColor.rgb = normalToColor( localSurfaceDirection );
  outputColor.a = 1.0;
}
