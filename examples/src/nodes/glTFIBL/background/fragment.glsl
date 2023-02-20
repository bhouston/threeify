precision highp float;

in vec4 v_homogeneousVertexPosition;

uniform mat4 viewToWorld;
uniform mat4 screenToView;

uniform samplerCube cubeMap;

out vec4 outputColor;

#pragma include <color/spaces/srgb>
#pragma include <cubemaps/latLong>
#pragma include <color/encodings/rgbe>
#pragma include <color/tonemapping/acesfilmic>

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
