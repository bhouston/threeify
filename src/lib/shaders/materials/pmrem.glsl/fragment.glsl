layout(set = 0, binding = 0) uniform sampler2D uPanorama;
layout(set = 0, binding = 1) uniform samplerCube uCubeMap;

// enum
const uint cLambertian = 0;
const uint cGGX = 1;
const uint cCharlie = 2;

layout(push_constant) uniform FilterParameters {
  float roughness;
  uint sampleCount;
  uint currentMipLevel;
  uint width;
  float lodBias;
  uint distribution; // enum
} pFilterParameters;

layout (location = 0) in vec2 inUV;

// output cubemap faces
layout(location = 0) out vec4 outFace0;
layout(location = 1) out vec4 outFace1;
layout(location = 2) out vec4 outFace2;
layout(location = 3) out vec4 outFace3;
layout(location = 4) out vec4 outFace4;
layout(location = 5) out vec4 outFace5;

layout(location = 6) out vec3 outLUT;
