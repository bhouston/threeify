precision highp float;

in vec4 v_homogeneousVertexPosition;

uniform mat4 viewToWorld;
uniform mat4 clipToView;

uniform samplerCube cubeMap;
uniform float cubeMapIntensity;

out vec4 outputColor;

void main() {
  // step one, convert from screen space to ray.
  vec4 worldPosition = viewToWorld * clipToView * v_homogeneousVertexPosition;
  vec3 worldNormal = normalize(worldPosition.xyz);

  outputColor = texture(cubeMap, worldNormal) * cubeMapIntensity;
}
