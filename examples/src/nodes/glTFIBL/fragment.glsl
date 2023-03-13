precision highp float;

#define DEBUG_OUTPUTS (0)
#define NUM_UV_CHANNELS (3)

in vec3 v_worldSurfacePosition;
in vec3 v_worldSurfaceNormal;
in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;
in vec2 v_uv1;
in vec2 v_uv2;

#pragma import "@threeify/core/dist/shaders/debug/nanDetector.glsl"


#define MAX_PUNCTUAL_LIGHTS (3)
#pragma import "@threeify/core/dist/shaders/lighting/punctualUniforms.glsl"
#pragma import "@threeify/core/dist/shaders/materials/physicalUniforms.glsl"

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToWorld;
uniform mat4 viewToScreen;

uniform int mode;
uniform sampler2D backgroundTexture;

uniform int debugOutputIndex;

uniform int outputTransformFlags;
uniform float exposure;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/tangentSpace.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/diffuse/lambert.glsl"

#pragma import "@threeify/core/dist/shaders/brdfs/specular/ggx.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/fresnel.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/ggx_ibl.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/sheen/charlie_ibl.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/sheen/charlie.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/sheen/sheenMix.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"
#pragma import "@threeify/core/dist/shaders/ao/ao.glsl"
#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/materials/alpha_mode.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/transmission/transmission.glsl"

#pragma import "@threeify/core/dist/shaders/materials/debugOutputs.glsl"
#pragma import "@threeify/core/dist/shaders/materials/physicalDebugOutputs.glsl"

void main() {
  vec2 uvs[NUM_UV_CHANNELS];
  uvs[0] = v_uv0;
  uvs[1] = v_uv1;
  uvs[2] = v_uv2;

  PhysicalMaterial material = readPhysicalMaterialFromUniforms(uvs);
  PHYSICAL_DEBUG_OUTPUT(material);

  DEBUG_OUTPUT(26, mod(v_uv0, 1.0));
  DEBUG_OUTPUT(27, mod(v_uv1, 1.0));
  DEBUG_OUTPUT(28, mod(v_uv2, 1.0));

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
  vec3 worldPosition = v_worldSurfacePosition;
  vec3 viewNormal =
    normalize(v_viewSurfaceNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 viewViewDirection = normalize(-v_viewSurfacePosition);
  DEBUG_OUTPUT(29, normalToRgb(viewViewDirection));

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    viewPosition,
    viewNormal,
    v_uv0
  );
  viewNormal = adjustNormal(tangentToView, material.normal);
  DEBUG_OUTPUT(30, normalToRgb(viewNormal));

  vec3 viewClearcoatNormal = adjustNormal(
    tangentToView,
    material.clearcoatNormal
  );
  DEBUG_OUTPUT(31, normalToRgb(viewClearcoatNormal));

  vec3 outgoingRadiance = vec3(0.0);

  // validated from https://github.com/KhronosGroup/glTF/blob/main/extensions/2./Khronos/KHR_materials_ior/README.md
  vec3 specularF0 =
    saturate(iorToF0(material.ior) * material.specularColor) *
    material.specularFactor;
  vec3 specularF90 = vec3(material.specularFactor);

  // validated from https://github.com/KhronosGroup/glTF/blob/main/extensions/2./Khronos/KHR_materials_specular/README.md
  specularF0 = mix(specularF0, material.albedo, material.metallic);
  specularF90 = mix(specularF90, vec3(1.0), material.metallic);
  vec3 albedo = mix(material.albedo, vec3(0.0), material.metallic);

  DEBUG_OUTPUT(32, specularF0);
  DEBUG_OUTPUT(33, specularF90);
  DEBUG_OUTPUT(34, albedo);

  vec3 clearcoatF0 = vec3(0.04);
  vec3 clearcoatF90 = vec3(1.0);

  vec3 transmission_btdf = vec3(0.0);

  if (material.transmission > 0.0 ) {
    vec3 worldViewDirection = mat4TransformDirection(
      viewToWorld,
      viewViewDirection
    );
    DEBUG_OUTPUT(35, normalToRgb(worldViewDirection));

    vec3 worldNormal = mat4TransformDirection(viewToWorld, viewNormal);
    DEBUG_OUTPUT(36, normalToRgb(worldNormal));

    vec3 transmissionRay = getVolumeTransmissionRay(
      worldNormal,
      worldViewDirection,
      material.thickness,
      material.ior,
      localToWorld
    );
    vec3 refractedRayExit = worldPosition + transmissionRay;
    DEBUG_OUTPUT(37, normalToRgb(refractedRayExit));

    // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
    vec4 ndcPos = viewToScreen * worldToView * vec4(refractedRayExit, 1.0);
    vec2 refractionCoords = ndcPos.xy / ndcPos.w;
    refractionCoords += 1.0;
    refractionCoords /= 2.0;
    DEBUG_OUTPUT(38, refractionCoords.xy);

    // Sample framebuffer to get pixel the refracted ray hits.
    vec4 transmittedLight = getTransmissionSample(
      backgroundTexture,
      refractionCoords,
      material.specularRoughness,
      ior
    );
    DEBUG_OUTPUT(39, transmittedLight.rgb);

    vec3 attenuatedColor =
      transmittedLight.xyz * // already pre-multiplied by alpha
      getVolumeAttenuation(
        length(transmissionRay),
        material.attenuationColor,
        material.attenuationDistance
      );
    DEBUG_OUTPUT(40, attenuatedColor);

    // Get the specular component.
    vec3 F = BRDF_Specular_GGX_IBL(
      worldNormal,
      worldViewDirection,
      specularF0,
      specularF90,
      material.specularRoughness
    );
    DEBUG_OUTPUT(41, F);

    transmission_btdf = (1.0 - F) * attenuatedColor * albedo;
    DEBUG_OUTPUT(42, transmission_btdf);
  }

  if (iblMapIntensity == vec3(0.0)) {
    outgoingRadiance += transmission_btdf * material.transmission;
  } else {
    //vec3 lightDirection = viewNormal;
    // vec3 reflectDirection = reflect( -viewDirection, viewNormal );

    float dotNV = saturate(dot(viewViewDirection, viewNormal));
    float clearCoatDotVN = saturate(
      dot(viewViewDirection, viewClearcoatNormal)
    );

    vec3 iblIrradiance = sampleIBLIrradiance(
      iblMapTexture,
      iblMapIntensity,
      iblMapMaxLod,
      viewNormal,
      worldToView
    );
    DEBUG_OUTPUT(43, iblIrradiance);

    vec3 iblRadiance = sampleIBLRadiance(
      iblMapTexture,
      iblMapIntensity,
      iblMapMaxLod,
      viewNormal,
      viewViewDirection,
      worldToView,
      material.specularRoughness
    );
    DEBUG_OUTPUT(44, iblRadiance);

    vec3 iblClearcoatRadiance = sampleIBLRadiance(
      iblMapTexture,
      iblMapIntensity,
      iblMapMaxLod,
      viewClearcoatNormal,
      viewViewDirection,
      worldToView,
      material.clearcoatRoughness
    );
    DEBUG_OUTPUT(45, iblClearcoatRadiance);

    // lambert diffuse
    vec3 diffuse_brdf = albedo * iblIrradiance * material.occlusion;
    DEBUG_OUTPUT(46, diffuse_brdf);

    vec3 indirect_brdf = mix(
      diffuse_brdf,
      transmission_btdf,
      material.transmission
    );
    DEBUG_OUTPUT(47, indirect_brdf);

    // specular layer
    vec3 singleScattering = vec3(0.0),
      multiScattering = vec3(0.0);
    BRDF_Specular_GGX_Multiscatter_IBL(
      viewNormal,
      viewViewDirection,
      specularF0,
      specularF90,
      material.specularRoughness,
      singleScattering,
      multiScattering
    );
    float specOcclusion = specularOcclusion(
      dotNV,
      material.occlusion,
      material.specularRoughness
    );
    vec3 specular_brdf =
      iblRadiance * singleScattering + multiScattering * iblIrradiance;

    DEBUG_OUTPUT(48, specular_brdf);

    indirect_brdf =
      indirect_brdf * (1.0 - max3(singleScattering + multiScattering)) +
      specular_brdf * specOcclusion;
    DEBUG_OUTPUT(49, indirect_brdf);

    // sheen
    //   if (material.sheenColor != vec3(0.)) {
    vec3 sheen_brdf =
      iblIrradiance *
      BRDF_Sheen_Charlie_IBL(
        viewNormal,
        viewViewDirection,
        material.sheenColor,
        material.sheenRoughness
      ) *
      specOcclusion;
    DEBUG_OUTPUT(50, sheen_brdf);

    indirect_brdf = sheenMix(material.sheenColor, indirect_brdf, sheen_brdf);
    DEBUG_OUTPUT(51, indirect_brdf);
    //   }

    // if (material.clearcoatFactor != 0.) {
    vec3 clearcoatHalfDirection = normalize(
      viewClearcoatNormal + viewViewDirection
    );
    float clearcoatVdotH = saturate(
      dot(viewViewDirection, clearcoatHalfDirection)
    );

    // clearcoat
    vec3 clearcoat_brdf =
      iblClearcoatRadiance *
      BRDF_Specular_GGX_IBL(
        viewClearcoatNormal,
        viewViewDirection,
        clearcoatF0,
        clearcoatF90,
        material.clearcoatRoughness
      ) *
      specularOcclusion(
        clearCoatDotVN,
        material.occlusion,
        material.clearcoatRoughness
      );
    DEBUG_OUTPUT(52, clearcoat_brdf);

    indirect_brdf = fresnelMix(
      clearcoatF0,
      clearcoatF90,
      clearcoatVdotH,
      material.clearcoatFactor,
      indirect_brdf,
      clearcoat_brdf
    );
    DEBUG_OUTPUT(53, indirect_brdf);

    // }

    outgoingRadiance += indirect_brdf;
  }

  // note: this for loop pattern is faster than using numPunctualLights as a loop condition
  for (int i = 0; i < MAX_PUNCTUAL_LIGHTS; i++) {
    if (i >= numPunctualLights) {
      break;
    }
    PunctualLight punctualLight = readPunctualLightFromUniforms(i, worldToView);
    // this line made the shader very slow on M1 Macs.  I don't know why.
    // if( punctualLight.intensity == vec3( 0. ) ) {
    //   continue;
    // }
    DirectLight directLight = punctualLightToDirectLight(
      viewPosition,
      punctualLight
    );

    float clearCoatDotNL = saturate(
      dot(directLight.direction, viewClearcoatNormal)
    );
    float clearCoatDotVN = saturate(
      dot(viewViewDirection, viewClearcoatNormal)
    );
    float dotNL = saturate(dot(directLight.direction, viewNormal));
    float dotNV = saturate(dot(viewViewDirection, viewNormal));

    vec3 halfDirection = normalize(directLight.direction + viewViewDirection);
    float VdotH = saturate(dot(viewViewDirection, halfDirection));

    vec3 irradiance = directLight.radiance * dotNL;
    DEBUG_OUTPUT(54, irradiance);

    vec3 clearcoatIrradiance = directLight.radiance * clearCoatDotNL;
    DEBUG_OUTPUT(55, clearcoatIrradiance);

    vec3 diffuse_brdf =
      irradiance * BRDF_Diffuse_Lambert(albedo) * material.occlusion;
    DEBUG_OUTPUT(56, diffuse_brdf);

    vec3 direct_brdf = diffuse_brdf;

    float specOcclusion = specularOcclusion(
      dotNV,
      material.occlusion,
      material.specularRoughness
    );
    DEBUG_OUTPUT(57, specOcclusion);

    vec3 specular_brdf =
      irradiance *
      BRDF_Specular_GGX_NoFrenel(
        viewNormal,
        viewViewDirection,
        directLight.direction,
        material.specularRoughness
      ) *
      specOcclusion;
    DEBUG_OUTPUT(58, specular_brdf);

    direct_brdf = fresnelMix(
      specularF0,
      specularF90,
      VdotH,
      material.specularFactor,
      diffuse_brdf,
      specular_brdf
    );
    DEBUG_OUTPUT(59, direct_brdf);

    // sheen
    //  if (material.sheenColor != vec3(0.)) {
    vec3 sheen_brdf =
      irradiance *
      BRDF_Sheen_Charlie(
        viewNormal,
        viewViewDirection,
        directLight.direction,
        material.sheenColor,
        material.sheenRoughness
      ) *
      material.occlusion;
    DEBUG_OUTPUT(60, sheen_brdf);

    direct_brdf = sheenMix(material.sheenColor, direct_brdf, sheen_brdf);
    DEBUG_OUTPUT(61, direct_brdf);
    //  }

    // clearcoat
    //if (material.clearcoatFactor != 0.) {
    vec3 clearcoat_brdf =
      clearcoatIrradiance *
      BRDF_Specular_GGX_NoFrenel(
        viewClearcoatNormal,
        viewViewDirection,
        directLight.direction,
        material.clearcoatRoughness
      ) *
      specularOcclusion(
        clearCoatDotVN,
        material.occlusion,
        material.clearcoatRoughness
      );
    DEBUG_OUTPUT(62, clearcoat_brdf);

    direct_brdf = fresnelMix(
      clearcoatF0,
      clearcoatF90,
      VdotH,
      material.clearcoatFactor,
      direct_brdf,
      clearcoat_brdf
    );

    DEBUG_OUTPUT(63, direct_brdf);
    // }

    outgoingRadiance += direct_brdf;
  }

  vec3 emissive_brdf = material.emissive;
  outgoingRadiance += emissive_brdf;

  vec3 tonemapped =
    (outputTransformFlags & 0x1) != 0
      ? tonemappingACESFilmic(outgoingRadiance)
      : outgoingRadiance;
  DEBUG_OUTPUT(64, tonemapped);
  vec3 sRGB =
    (outputTransformFlags & 0x2) != 0
      ? linearTosRGB(tonemapped)
      : tonemapped;

  DEBUG_OUTPUT(65, sRGB);

  vec3 premultipliedAlpha =
    (outputTransformFlags & 0x4) != 0
      ? sRGB * material.alpha
      : sRGB;

  outputColor.rgb = premultipliedAlpha;
  outputColor.a = material.alpha;

}
