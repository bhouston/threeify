precision highp float;

in vec3 v_viewSurfacePosition;
in vec4 v_screenSurfacePosition;

in vec3 v_previousViewSurfacePosition;
in vec4 v_previousScreenSurfacePosition;

uniform float deltaTime;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/hsl.glsl"

void main() {

  vec2 screenSurfaceVelocity = (v_screenSurfacePosition - v_previousScreenSurfacePosition).xy / deltaTime;

  float angle = atan( screenSurfaceVelocity.x, screenSurfaceVelocity.y );
  float speed = length( screenSurfaceVelocity );

  vec3 debugColor = vec3( screenSurfaceVelocity.x* 10000.0, screenSurfaceVelocity.y * 10000.0, 0.0 );

  outputColor.rgb = linearTosRGB(debugColor);
  outputColor.a = 1.0;

}
