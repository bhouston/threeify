precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;

out vec4 outputColor;

// transforms
uniform mat4 worldToLocal;
uniform mat4 viewToWorld;

// internal gem geometry
uniform samplerCube normalCubeMap;

#pragma import "@threeify/core/dist/shaders/math.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"
#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"

void main() {
  vec3 viewSurfaceNormal = normalize(v_viewSurfaceNormal);

  mat4 viewToLocal = worldToLocal * viewToWorld;
  vec3 localSurfaceNormal = mat4TransformNormal3(
    viewToLocal,
    viewSurfaceNormal
  );

  // trace ray into gem
  //outputColor.rgb = normalToColor( localSurfaceNormal );
  outputColor.rgb = texture(normalCubeMap, normalize( viewSurfaceNormal ), 0.0).rgb;
  outputColor.a = 1.0;
}
