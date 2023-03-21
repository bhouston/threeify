precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

out vec4 outputColor;

// transforms
uniform mat4 localToWorld;
uniform mat4 worldToLocal;
uniform mat4 worldToView;
uniform mat4 viewToWorld;
uniform mat4 viewToClip;

// environmental lighting
uniform samplerCube iblMapTexture;
uniform float iblMapIntensity;
uniform int iblMapMaxLod;

// material properties, a subset of glTF Physical material
uniform float ior;
uniform float transmissionFactor;
uniform float attenuationDistance;
uniform vec3 attenuationColor;
uniform float abbeNumber;

// internal gem geometry
uniform samplerCube internalNormalMap;
uniform vec3 internalNormalMapScale;

#pragma import "@threeify/core/dist/shaders/math.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/fresnel.glsl"
#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/ggx_ibl.glsl"

#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

vec3 getIBLSample(vec3 sampleDir, float roughness) {
  float mipCount = float(iblMapMaxLod);
  float lod = clamp(roughness * mipCount, 0.0, mipCount);
  return texture(iblMapTexture, sampleDir, 0.0).rgb * iblMapIntensity;
}

void main() {
  vec3 viewSurfacePosition = v_viewSurfacePosition;
  vec3 viewSurfaceNormal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);
  vec3 halfVector = normalize(viewDirection + viewSurfaceNormal);

  mat4 viewToLocal = worldToLocal * viewToWorld;
  vec3 localDirection = mat4TransformDirection(viewToLocal, viewSurfaceNormal);

  float VdotH = saturate(dot(viewDirection, halfVector));

  // reflect view direction off of surface normal
  vec3 reflectDir = reflect(viewDirection, viewSurfaceNormal);

  // sample IBL
  float defaultRoughness = 0.003;
  vec3 iblSample = getIBLSample(reflectDir, defaultRoughness);

  // given ior calculate F0
  vec3 F0 = vec3(iorToF0(ior));
  vec3 F90 = vec3(1.0);

  // trace ray into gem
  vec3 internalRadiance = texture(internalNormalMap, localDirection, 0.0).rgb;

  // calculate surface reflectivity
  vec3 surfaceReflectivity = BRDF_Specular_GGX_IBL(
    viewSurfaceNormal,
    viewDirection,
    F0,
    F90,
    defaultRoughness
  );

  vec3 outgoingRadiance;
  outgoingRadiance += fresnelMix(
    F0,
    F90,
    VdotH,
    1.0,
    internalRadiance,
    surfaceReflectivity * iblSample
  );

  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(outgoingRadiance));
  outputColor.a = 1.0;

}
