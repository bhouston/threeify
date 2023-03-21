precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;

out vec4 outputColor;

// transforms
uniform mat4 localToWorld;
uniform mat4 worldToLocal;
uniform mat4 worldToView;
uniform mat4 viewToWorld;
uniform mat4 viewToClip;

// internal gem geometry
uniform samplerCube normalCubeMap;

#pragma import "@threeify/core/dist/shaders/math.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  vec3 viewSurfaceNormal = normalize(v_viewSurfaceNormal);

  mat4 viewToLocal = worldToLocal * viewToWorld;
  vec3 localSurfaceNormal = mat4TransformDirection(
    viewToLocal,
    viewSurfaceNormal
  );

  // trace ray into gem
  outputColor = texture(normalCubeMap, localSurfaceNormal, 0.0);
}
