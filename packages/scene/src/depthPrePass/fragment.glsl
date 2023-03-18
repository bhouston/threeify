precision highp float;

#define NUM_UV_CHANNELS (3)

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;
in vec2 v_uv1;
in vec2 v_uv2;

#pragma import "@threeify/core/dist/shaders/materials/physicalUniforms.glsl"

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToWorld;
uniform mat4 viewToClip;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/tangentSpace.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"
#pragma import "@threeify/core/dist/shaders/materials/alpha_mode.glsl"
#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/materials/physicalDebugOutputs.glsl"

void main() {
  vec2 uvs[NUM_UV_CHANNELS];
  uvs[0] = v_uv0;
  uvs[1] = v_uv1;
  uvs[2] = v_uv2;

  PhysicalMaterial material = readPhysicalMaterialFromUniforms(uvs);

  if (
    material.alphaMode == ALPHAMODE_MASK &&
    material.alpha < material.alphaCutoff
  ) {
    // required on Apple M1 platforms (and maybe others?) to avoid artifacts.
    // discussed here: https://mastodon.gamedev.place/@BenHouston3D/109818279574922717
    outputColor.rgba = vec4(0.0);
    gl_FragDepth = 1.0;
    discard;
  } else {
    gl_FragDepth = gl_FragCoord.z;
  }

  vec3 viewPosition = v_viewSurfacePosition;
  vec3 viewNormal =
    normalize(v_viewSurfaceNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 viewViewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    viewPosition,
    viewNormal,
    v_uv0
  );
  viewNormal = adjustNormal(tangentToView, material.normal);
  outputColor.rgb = normalToColor( viewNormal );

  if( material.clearcoat > 0.0 ) {
    vec3 viewClearcoatNormal = adjustNormal(
      tangentToView,
      material.clearcoatNormal
    );
    outputColor.rgb = normalToColor( viewClearcoatNormal );
  }

  outputColor.a = 1;
}
