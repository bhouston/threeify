precision highp float;

in vec2 v_uv0;

uniform samplerCube cubeMap;
uniform float cubeMapIntensity;
uniform mat4 viewToWorld;
uniform mat4 viewToScreen;
uniform mat4 screenToView;

out vec4 outputColor;

vec4 fragCoordAnDepthToScreenPosition( const in vec2 fragCoord, const in float fragDepth ) {
  return vec4(fragCoord.xy * 2.0 - 1.0, 2.0 * fragDepth - 1.0, 1.0);
}

vec4 screenPositionToViewPosition( const in mat4 screenToView, const in vec4 screenPosition ) {
  vec4 viewPosition = screenToView * screenPosition;
  viewPosition.xyz /= viewCoord.w;
  return viewPosition;
}

void main() {

  float centerViewZ = getViewZ( centerDepth );
			vec3 viewPosition = getViewPosition( vUv, centerDepth, centerViewZ );


  // construct screen coordinate
  vec4 screenCoord = vec4( gl_FragCoord.xy, 1.0 );

  // convert screen to view
  vec4 viewCoord = screenToView * screenCoord;
  // convert to world
  vec4 worldCoord = viewToWorld * viewCoord;

  // normalize and then look up in cube map
  vec3 worldNormal = normalize(worldCoord.xyz);
  
  outputColor = texture(cubeMap, worldNormal) * cubeMapIntensity;
}
