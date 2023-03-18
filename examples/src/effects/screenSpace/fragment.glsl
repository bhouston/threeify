precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec4 v_clipSurfacePosition;
in vec2 v_uv0;

uniform mat4 clipToView;

uniform mat4 viewToClip;
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
    outputColor = vec4( normalToColor( normal ), 1.0 );
    return;
  }
  
  if( mode == 1 ) {
    outputColor.rgb = hslToColor( v_viewSurfacePosition.z, 0.5, 0.5 );
    outputColor.a = 1.0;
    return;
  }

  // screen uv coord
  vec2 screenUv = fragCoordToUVSpace( gl_FragCoord.xy, screenSize );
  if( mode == 2 ) {
    outputColor = vec4( screenUv, 0.0, 1.0);
    return;
  }

  // reconstruct depth from depthMap and nearZ/farZ
  float depth = texture( depthMap, screenUv ).r;
  float viewZ = perspectiveDepthToViewZ( depth, nearZ, farZ );
  if( mode == 3)  {
    outputColor.rgb = hslToColor( viewZ, 0.5, 0.5 );
    outputColor.a = 1.0;
    return;
  }

  // error between reconstructed depth and true depth
  float viewZError = abs( viewZ - v_viewSurfacePosition.z );
  if( mode == 4)  {
    outputColor.rgb = vec3( viewZError * 4.0 + 0.1, 0.1, 0.1 );
    outputColor.a = 1.0;
    return;
  }

  // construct clip position
  float clipW = viewZToClipW( viewToClip, viewZ);
  vec4 clipPosition = vec4( ( 2.0 * vec3( screenUv, depth ) - 1.0 ) * clipW, clipW );
  float clipPositionError = distance( clipPosition.xy, v_clipSurfacePosition.xy );
  if( mode == 5)  {
    outputColor.rgb = vec3( 0.1, clipPositionError * 4.0 + 0.1, 0.1 );
    outputColor.a = 1.0;
    return;
  }

  // reconstruct view position from clip position
  vec3 viewPosition = clipPositionToViewPosition( clipToView, clipPosition );
  float viewPositionError = distance( viewPosition, v_viewSurfacePosition );
  if( mode == 6)  {
    outputColor.rgb = vec3( 0.1, 0.1, viewPositionError * 4.0 + 0.1 );
    outputColor.a = 1.0;
    return;
  }
  //vec4 viewPosition = reconstructViewPosition( clipToView, gl_FragCoord );

  outputColor = vec4( 1.0, 0.0, 0.0, 1.0);
}
