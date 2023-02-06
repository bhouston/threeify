precision highp float;

#define NUM_UV_CHANNELS (3)

in vec3 v_worldSurfacePosition;
in vec3 v_worldSurfaceNormal;
in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;
in vec2 v_uv1;
in vec2 v_uv2;

#define MAX_PUNCTUAL_LIGHTS (3)
#pragma include <lighting/punctualUniforms>
#pragma include <materials/physicalUniforms>

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

uniform sampler2D backgroundTexture;

uniform int debugOutputIndex;

out vec4 outputColor;

#pragma include <microgeometry/tangentSpace>
#pragma include <brdfs/diffuse/lambert>

#pragma include <brdfs/specular/ggx>
#pragma include <brdfs/specular/fresnel>
#pragma include <brdfs/specular/ggx_ibl>
#pragma include <brdfs/sheen/charlie_ibl>
#pragma include <brdfs/sheen/charlie>
#pragma include <brdfs/sheen/sheenMix>
#pragma include <math/mat4>
#pragma include <ao/ao>
#pragma include <color/tonemapping/acesfilmic>
#pragma include <materials/alpha_mode>
#pragma include <brdfs/transmission/transmission>

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
    gl_FragDepth = 1.0;
    discard;
  } else {
    gl_FragDepth = gl_FragCoord.z;
  }

  if (debugOutputIndex > 0 && debugOutputIndex < 26) {
    outputColor = debugOutput(debugOutputIndex, material);
    return;
  }
  vec3 viewPosition = v_viewSurfacePosition;
  vec3 worldPosition = v_worldSurfacePosition;
  vec3 viewNormal =
    normalize(v_viewSurfaceNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 viewViewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    viewPosition,
    viewNormal,
    v_uv0
  );
  viewNormal = adjustNormal(tangentToView, material.normal);
  if (debugOutputIndex == 26) {
    outputColor = toVec4(normalToRgb(viewNormal));
    return;
  }

  vec3 viewClearcoatNormal = adjustNormal(
    tangentToView,
    material.clearcoatNormal
  );
  if (debugOutputIndex == 27) {
    outputColor = toVec4(normalToRgb(viewClearcoatNormal));
    return;
  }

  vec3 outgoingRadiance = vec3(0.0);

  //material.albedo = vec3( 1. );
  //material.occlusion = 1.;
  //material.metallic = 0.;
  //material.emissive = vec3( 0. );
  //material.specularRoughness = 0.5;

  // validated from https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_ior/README.md
  vec3 specularF0 =
    saturate(iorToF0(material.ior) * material.specularColor) *
    material.specularFactor;
  vec3 specularF90 = vec3(material.specularFactor);

  // validated from https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_specular/README.md
  specularF0 = mix(specularF0, material.albedo, material.metallic);
  specularF90 = mix(specularF90, vec3(1.0), material.metallic);
  vec3 albedo = mix(material.albedo, vec3(0.0), material.metallic);

  if (debugOutputIndex == 28) {
    outputColor = toVec4(specularF0);
    return;
  }
  if (debugOutputIndex == 29) {
    outputColor = toVec4(specularF90);
    return;
  }
  if (debugOutputIndex == 30) {
    outputColor = toVec4(albedo);
    return;
  }

  vec3 clearcoatF0 = vec3(0.04);
  vec3 clearcoatF90 = vec3(1.0);

  vec3 worldViewDirection = mat4UntransformDirection(
    worldToView,
    viewViewDirection
  );

  if (debugOutputIndex == 31) {
    outputColor = toVec4(normalToRgb(worldViewDirection));
    return;
  }

  vec3 worldNormal = mat4UntransformDirection(worldToView, viewNormal);
  if (debugOutputIndex == 32) {
    outputColor = toVec4(normalToRgb(worldNormal));
    return;
  }

  vec3 transmissionRay = getVolumeTransmissionRay(
    worldNormal,
    worldViewDirection,
    material.thickness,
    material.ior,
    localToWorld
  );
  vec3 refractedRayExit = worldPosition + transmissionRay;

  // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
  vec4 ndcPos = viewToScreen * worldToView * vec4(refractedRayExit, 1.0);
  vec2 refractionCoords = ndcPos.xy / ndcPos.w;
  refractionCoords += 1.0;
  refractionCoords /= 2.0;

  // Sample framebuffer to get pixel the refracted ray hits.
  vec4 transmittedLight = getTransmissionSample(
    backgroundTexture,
    refractionCoords,
    material.specularRoughness,
    ior
  );
  if (debugOutputIndex == 33) {
    outputColor = toVec4(transmittedLight.rgb);
    return;
  }
  vec3 attenuatedColor =
    transmittedLight.xyz *
    getVolumeAttenuation(
      length(transmissionRay),
      material.attenuationColor,
      material.attenuationDistance
    );
  if (debugOutputIndex == 34) {
    outputColor = toVec4(attenuatedColor);
    return;
  }
  // Get the specular component.
  vec3 F = BRDF_Specular_GGX_IBL(
    worldNormal,
    worldViewDirection,
    specularF0,
    specularF90,
    material.specularRoughness
  );
  if (debugOutputIndex == 35) {
    outputColor = toVec4(F);
    return;
  }

  vec4 transmission_btdf = vec4(
    (1.0 - F) * attenuatedColor * albedo,
    transmittedLight.a
  );

  /*vec4 transmission_btdf = BTDF_TransmissionAttenuation(
      worldNormal,
      worldViewDirection,
      worldPosition,
      localToWorld,
      worldToView,
      viewToScreen,
      material.albedo,
      specularF0,
      specularF90,
      material.ior,
      material.specularRoughness,
      material.thickness,
      material.attenuationColor,
      material.attenuationDistance,
      backgroundTexture
    );*/

  if (debugOutputIndex == 36) {
    outputColor = toVec4(transmission_btdf);
    return;
  }

  // TODO: Just adding it here is completely wrong, also I am skipping the alpha component.
  outgoingRadiance += transmission_btdf.xyz;

  if (iblMapIntensity != vec3(0.0)) {
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
    if (debugOutputIndex == 37) {
      outputColor = toVec4(iblIrradiance);
      return;
    }
    vec3 iblRadiance = sampleIBLRadiance(
      iblMapTexture,
      iblMapIntensity,
      iblMapMaxLod,
      viewNormal,
      viewViewDirection,
      worldToView,
      material.specularRoughness
    );
    if (debugOutputIndex == 37) {
      outputColor = toVec4(iblRadiance);
      return;
    }
    vec3 iblClearcoatRadiance = sampleIBLRadiance(
      iblMapTexture,
      iblMapIntensity,
      iblMapMaxLod,
      viewClearcoatNormal,
      viewViewDirection,
      worldToView,
      material.clearcoatRoughness
    );
    if (debugOutputIndex == 39) {
      outputColor = toVec4(iblClearcoatRadiance);
      return;
    }

    // lambert diffuse
    vec3 diffuse_brdf = albedo * iblIrradiance * material.occlusion;
    if (debugOutputIndex == 40) {
      outputColor = toVec4(diffuse_brdf);
      return;
    }
    //vec3 specular_btdf = BTDF_SpecularGGX_IBL( viewNormal, viewViewDirection, material.specularRoughness );
    vec3 indirect_brdf = diffuse_brdf;

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

    if (debugOutputIndex == 41) {
      outputColor = toVec4(specular_brdf);
      return;
    }
    indirect_brdf =
      indirect_brdf * (1.0 - max3(singleScattering + multiScattering)) +
      specular_brdf * specOcclusion;
    if (debugOutputIndex == 42) {
      outputColor = toVec4(indirect_brdf);
      return;
    }
    // sheen
    //   if (material.sheenColor != vec3(0.0)) {
    vec3 sheen_brdf =
      iblIrradiance *
      BRDF_Sheen_Charlie_IBL(
        viewNormal,
        viewViewDirection,
        material.sheenColor,
        material.sheenRoughness
      ) *
      material.occlusion;
    if (debugOutputIndex == 43) {
      outputColor = toVec4(sheen_brdf);
      return;
    }
    indirect_brdf = sheenMix(material.sheenColor, indirect_brdf, sheen_brdf);
    if (debugOutputIndex == 44) {
      outputColor = toVec4(indirect_brdf);
      return;
    }
    //   }

    // if (material.clearcoatFactor != 0.0) {
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
    if (debugOutputIndex == 45) {
      outputColor = toVec4(clearcoat_brdf);
      return;
    }

    indirect_brdf = fresnelMix(
      clearcoatF0,
      clearcoatF90,
      clearcoatVdotH,
      material.clearcoatFactor,
      indirect_brdf,
      clearcoat_brdf
    );

    if (debugOutputIndex == 46) {
      outputColor = toVec4(indirect_brdf);
      return;
    }

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

    if (debugOutputIndex == 47) {
      outputColor = toVec4(irradiance);
      return;
    }

    vec3 clearcoatIrradiance = directLight.radiance * clearCoatDotNL;
    if (debugOutputIndex == 48) {
      outputColor = toVec4(clearcoatIrradiance);
      return;
    }
    vec3 diffuse_brdf =
      irradiance * BRDF_Diffuse_Lambert(albedo) * material.occlusion;
    if (debugOutputIndex == 49) {
      outputColor = toVec4(diffuse_brdf);
      return;
    }

    vec3 direct_brdf = diffuse_brdf;

    vec3 specular_brdf =
      irradiance *
      BRDF_Specular_GGX_NoFrenel(
        viewNormal,
        viewViewDirection,
        directLight.direction,
        material.specularRoughness
      ) *
      specularOcclusion(dotNV, material.occlusion, material.specularRoughness);

    if (debugOutputIndex == 50) {
      outputColor = toVec4(specular_brdf);
      return;
    }
    direct_brdf = fresnelMix(
      specularF0,
      specularF90,
      VdotH,
      material.specularFactor,
      diffuse_brdf,
      specular_brdf
    );

    if (debugOutputIndex == 51) {
      outputColor = toVec4(direct_brdf);
      return;
    }

    // sheen
    //  if (material.sheenColor != vec3(0.0)) {
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

    if (debugOutputIndex == 52) {
      outputColor = toVec4(sheen_brdf);
      return;
    }
    direct_brdf = sheenMix(material.sheenColor, direct_brdf, sheen_brdf);
    if (debugOutputIndex == 53) {
      outputColor = toVec4(direct_brdf);
      return;
    }
    //  }

    // clearcoat
    //if (material.clearcoatFactor != 0.0) {
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
    if (debugOutputIndex == 54) {
      outputColor = toVec4(clearcoat_brdf);
      return;
    }
    direct_brdf = fresnelMix(
      clearcoatF0,
      clearcoatF90,
      VdotH,
      material.clearcoatFactor,
      direct_brdf,
      clearcoat_brdf
    );

    if (debugOutputIndex == 55) {
      outputColor = toVec4(direct_brdf);
      return;
    }
    // }

    outgoingRadiance += direct_brdf;
  }

  vec3 emissive_brdf = material.emissive;
  outgoingRadiance += emissive_brdf;

  vec3 tonemapped = tonemappingACESFilmic(outgoingRadiance);

  if (debugOutputIndex == 56) {
    outputColor = toVec4(tonemapped);
    return;
  }
  //  outputColor.rgb = tonemappingACESFilmic( linearTosRGB( outgoingRadiance ) );
  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(outgoingRadiance));
  outputColor.a = material.alpha;

}
