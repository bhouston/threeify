precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_screenSurfacePosition;
in vec3 v_viewSurfaceNormal;

in vec3 v_previousViewSurfacePosition;
in vec3 v_previousScreenSurfacePosition;

in vec2 v_uv0;

uniform float deltaTime;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/hsl.glsl"

void main() {

  vec3 screenSurfaceVelocity = (v_screenSurfacePosition - v_previousScreenSurfacePosition) / deltaTime;

  float angle = atan2( velocity.x, velocity.y );
  float speed = length( velocity );

  vec3 debugColor = hsl2rgb( angle / PI, 1.0, speed * 10.0 );

  outputColor.rgb = linearTosRGB(debugColor);
  outputColor.a = 1.0;

}
