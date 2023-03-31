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
uniform mat4 gemToLocal;
uniform mat4 localToGem;

// environmental lighting
uniform samplerCube iblWorldMap;
uniform float iblIntensity;
uniform int iblMipCount;

uniform int gemMaxBounces;
uniform int hitRefines;

// material properties, a subset of glTF Physical material
uniform float ior;
uniform vec3 gemSquishFactor;
uniform float transmissionFactor;
uniform float attenuationDistance;
uniform vec3 attenuationColor;
uniform float abbeNumber;
uniform float gemBoostFactor;

// internal gem geometry
uniform samplerCube gemNormalCubeMap;

#pragma import "@threeify/core/dist/shaders/math.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/fresnel.glsl"
#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/ggx_ibl.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"
#pragma import "@threeify/core/dist/shaders/raytracing/gem.glsl"

//#define DEBUG_NORMAL_CUBE_MAP (1)

void main() {


  vec3 viewSurfaceNormal = normalize(v_viewSurfaceNormal);
  vec3 viewViewDirection = normalize(-v_viewSurfacePosition);
  
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

  vec3 gemViewOrigin = mat4TransformPosition(localToGem, localViewOrigin);
  vec3 gemViewDirection = mat4TransformDirection(localToGem, localViewDirection);

  vec3 gemPosition = mat4TransformPosition(localToGem, localPosition);
  vec3 gemSurfaceNormal = mat4TransformDirection(localToGem, localSurfaceNormal);
 
  Ray gemIncidentRay = Ray(gemViewOrigin, -gemViewDirection);
  Sphere sphere = Sphere(vec3(0.0), 1.0);
  Hit gemSurfaceHit = Hit(0.0, gemPosition, gemSurfaceNormal);

  mat4 gemToWorld = localToWorld * gemToLocal;

#if defined(DEBUG_NORMAL_CUBE_MAP)
  outputColor.rgb = texture(gemNormalCubeMap, gemSurfaceNormal, 0.0 ).rgb;
  outputColor.a = 1.0;
  return;
#endif

  vec3 outgoingRadiance;

  outgoingRadiance += rayTraceTransmission(
    gemIncidentRay,
    gemSurfaceHit,
    sphere,
    ior,
    attenuationColor,
    gemNormalCubeMap,
    gemSquishFactor,
    gemBoostFactor,
    gemMaxBounces,
    hitRefines,
    gemToWorld,
    iblWorldMap
  );

  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(outgoingRadiance));
  outputColor.a = 1.0;

}
