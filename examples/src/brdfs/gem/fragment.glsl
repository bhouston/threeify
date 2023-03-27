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
uniform samplerCube iblWorldMap;
uniform float iblIntensity;
uniform int iblMipCount;

uniform int maxBounces;

// material properties, a subset of glTF Physical material
uniform float ior;
uniform vec3 squishFactor;
uniform float transmissionFactor;
uniform float attenuationDistance;
uniform vec3 attenuationColor;
uniform float abbeNumber;
uniform float boostFactor;

// internal gem geometry
uniform samplerCube gemNormalCubeMap;

#pragma import "@threeify/core/dist/shaders/math.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/fresnel.glsl"
#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/ggx_ibl.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"
#pragma import "@threeify/core/dist/shaders/raytracing/gem.glsl"

vec3 getIBLSample(vec3 worldDirection, float roughness) {
  float mipCount = float(iblMipCount);
  float lod = clamp(roughness * mipCount, 0.0, mipCount);
  return texture(iblWorldMap, worldDirection, 0.0).rgb * iblIntensity;
}

void main() {
  vec3 viewSurfacePosition = v_viewSurfacePosition;
  vec3 viewSurfaceNormal = normalize(v_viewSurfaceNormal);
  vec3 viewViewDirection = normalize(-v_viewSurfacePosition);
  vec3 halfVector = normalize(viewViewDirection + viewSurfaceNormal);

  mat4 viewToLocal = worldToLocal * viewToWorld;
  vec3 localSurfaceNormal = mat4TransformDirection(
    viewToLocal,
    viewSurfaceNormal
  );
  vec3 localViewOrigin = mat4TransformPosition(viewToLocal, vec3(0.0));
  vec3 localPosition = mat4TransformPosition(
    viewToLocal,
    v_viewSurfacePosition
  );
    vec3 localViewDirection = mat4TransformDirection(
    viewToLocal,
    viewViewDirection
  );

  vec3 localViewToPositionDirection = normalize(
    localPosition - localViewOrigin
  );
  mat4 localToView = worldToView * localToWorld;

  Ray localIncidentRay = Ray(localViewOrigin, -localViewDirection);
  Sphere sphere = Sphere(vec3(0.0), 0.5);
  Hit localSurfaceHit = Hit(0.0, localPosition, localSurfaceNormal);

  vec3 outgoingRadiance;

  outgoingRadiance += rayTraceTransmission(
    localIncidentRay,
    localSurfaceHit,
    sphere,
    ior,
    attenuationColor,
    gemNormalCubeMap,
    squishFactor,
    boostFactor,
    maxBounces,
    localToWorld,
    iblWorldMap
  );

  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(outgoingRadiance));
  outputColor.a = 1.0;

}
