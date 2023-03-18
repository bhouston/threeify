precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

uniform mat4 clipToView;
uniform int mode;
uniform sampler2D depthMap;
uniform float nearZ;
uniform float farZ;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/hsl.glsl"
#pragma import "@threeify/core/dist/shaders/screenSpace/screenSpace.glsl"

void main() {
  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  vec2 screenSize = vec2( textureSize( depthMap, 0 ) );

  if( mode == 0 ) {
    outputColor = vec4( normalToColor( normal), 1.0 );
    return;
  }
  
   if( mode == 1 ) {
    outputColor.rgb = hslToColor( v_viewSurfacePosition.z, 0.5, 0.5 );
    outputColor.a = 1.0;
    return;
  }

  vec2 screenUv = gl_FragCoord.xy / screenSize;
  if( mode == 2 ) {
    outputColor = vec4( screenUv, 0.0, 1.0);
    return;
  }
    float depth = texture( depthMap, screenUv ).r;
   float viewZ = perspectiveDepthToViewZ( depth, nearZ, farZ );
  if( mode == 3)  {
    outputColor.rgb = hslToColor( viewZ, 0.5, 0.5 );
    outputColor.a = 1.0;
    return;
  }
  float error = abs( viewZ - v_viewSurfacePosition.z );
   if( mode == 4)  {
    outputColor.rgb = vec3( error * 4.0 + 0.1, 0.1, 0.1 );
    outputColor.a = 1.0;
    return;
  }

  //vec4 viewPosition = reconstructViewPosition( clipToView, gl_FragCoord );

  outputColor = vec4( 1.0, 0.0, 0.0, 1.0);
}
