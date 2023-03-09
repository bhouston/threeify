precision highp float;

in vec4 v_homogeneousVertexPosition;

uniform mat4 viewToWorld;
uniform mat4 screenToView;

uniform samplerCube cubeMap;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/cubemaps/latLong.glsl"
#pragma import "@threeify/core/dist/shaders/color/encodings/rgbe.glsl"
#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"

void main() {
  // step one, convert from screen space to ray.
  vec3 viewPosition = (viewToWorld *
    screenToView *
    v_homogeneousVertexPosition).xyz;
  vec3 viewDirection = normalize(viewPosition);

  vec3 mapColor = vec3(0.0);
  mapColor += rgbeToLinear(texture(cubeMap, -viewDirection));

  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(mapColor));
  outputColor.a = 1.0;

}
