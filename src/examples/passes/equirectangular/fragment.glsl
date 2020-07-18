precision highp float;

uniform mat4 viewToWorld;
uniform mat4 screenToView;

uniform sampler2D equirectangularMap;

varying vec4 v_homogeneousVertexPosition;

#pragma include <color/spaces/srgb>
#pragma include <cubemaps/equirectangular>

void main() {

  // step one, convert from screen space to ray.
  vec3 eyePosition = vec3(0.0);
  vec3 nearClipPosition = ( viewToWorld * screenToView * v_homogeneousVertexPosition ).xyz;

  vec3 direction = normalize( nearClipPosition - eyePosition );

  vec2 equirectangularUv = directionToEquirectangularUV( direction );

  vec3 outputColor = vec3(0.);
  outputColor += sRGBToLinear( texture2D( equirectangularMap, equirectangularUv ).rgb );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  gl_FragColor.a = 1.0;

}
