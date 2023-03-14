precision highp float;

in vec4 v_homogeneousVertexPosition;

uniform mat4 viewToWorld;
uniform mat4 clipToView;

uniform sampler2D equirectangularMap;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/cubemaps/latLong.glsl"

void main() {
  // step one, convert from screen space to ray.
  vec3 viewPosition = (viewToWorld *
    clipToView *
    v_homogeneousVertexPosition).xyz;
  vec3 viewDirection = normalize(viewPosition);

  vec2 equirectangularUv = directionToLatLongUV(viewDirection);

  vec3 mapColor = vec3(0.0);
  mapColor += sRGBToLinear(texture(equirectangularMap, equirectangularUv).rgb);

  outputColor.rgb = linearTosRGB(mapColor);
  outputColor.a = 1.0;

}
