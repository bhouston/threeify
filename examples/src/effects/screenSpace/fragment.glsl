precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform mat4 clipToView;
uniform int mode;
uniform sampler2D depthMap;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/hsl.glsl"
#pragma import "@threeify/core/dist/shaders/screenSpace/screenSpace.glsl"

void main() {
  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  if( mode == 0 ) {
    outputColor = vec4( normalToColor( normal), 1.0 );
    return;
  }

}
