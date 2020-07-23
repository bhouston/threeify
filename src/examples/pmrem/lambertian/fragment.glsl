precision highp float;

uniform mat4 viewToWorld;
uniform mat4 screenToView;

uniform sampler2D equirectangularMap;

varying vec4 v_homogeneousVertexPosition;

#pragma include <color/spaces/srgb>
#pragma include <cubemaps/equirectangular>

void main() {

  // step one, convert from screen space to ray.
  vec3 viewPosition = ( viewToWorld * screenToView * v_homogeneousVertexPosition ).xyz;
  vec3 viewDirection = normalize( viewPosition );

  vec2 equirectangularUv = directionToEquirectangularUV( viewDirection );

  vec3 outputColor = vec3(0.);
  outputColor += sRGBToLinear( texture2D( equirectangularMap, equirectangularUv ).rgb );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  gl_FragColor.a = 1.0;

}
