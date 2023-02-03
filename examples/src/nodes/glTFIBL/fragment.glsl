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
    // TODO: fix blending mode for alpha mask objects!!!!
    outputColor.rgb = vec3( 0. );
    outputColor. a = 0.;
    return;
  }
  vec3 viewPosition = v_viewSurfacePosition;
  vec3 worldPosition = v_worldSurfacePosition;
  vec3 viewNormal = normalize(v_viewSurfaceNormal);
  vec3 viewViewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    viewPosition,
    viewNormal,
    v_uv0
  );
  viewNormal = adjustNormal(tangentToView, material.normal);
  vec3 viewClearcoatNormal = adjustNormal(
    tangentToView,
    material.clearcoatNormal
  );

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

  vec3 clearcoatF0 = vec3(0.04);
  vec3 clearcoatF90 = vec3(1.0);

  if( material.transmission != 0. ) {

    vec3 worldViewDirection = mat4UntransformDirection( worldToView, viewViewDirection );
    vec3 worldNormal = mat4UntransformDirection( worldToView, viewNormal );

    vec4 transmission_btdf = BTDF_TransmissionAttenuation(
      worldNormal, worldViewDirection, worldPosition,
      localToWorld, worldToView, viewToScreen,
      material.albedo, specularF0, specularF90, material.ior, material.specularRoughness, 
      material.thickness, material.attenuationColor, material.attenuationDistance,
      backgroundTexture );

    // TODO: Just adding it here is completely wrong, also I am skipping the alpha component.
    outgoingRadiance += transmission_btdf.xyz;

  }
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
    vec3 iblRadiance = sampleIBLRadiance(
      iblMapTexture,
      iblMapIntensity,
      iblMapMaxLod,
      viewNormal,
      viewViewDirection,
      worldToView,
      material.specularRoughness
    );
    vec3 iblClearcoatRadiance = sampleIBLRadiance(
      iblMapTexture,
      iblMapIntensity,
      iblMapMaxLod,
      viewClearcoatNormal,
      viewViewDirection,
      worldToView,
      material.clearcoatRoughness
    );

    // lambert diffuse
    vec3 diffuse_brdf = albedo * iblIrradiance * material.occlusion;
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
    indirect_brdf =
      indirect_brdf * (1.0 - max3(singleScattering + multiScattering)) +
      specular_brdf * specOcclusion;

    // sheen
    if (material.sheenColor != vec3(0.0)) {
      vec3 sheen_brdf =
        iblIrradiance *
        BRDF_Sheen_Charlie_IBL(
          viewNormal,
          viewViewDirection,
          material.sheenColor,
          material.sheenRoughness
        ) *
        material.occlusion;
      indirect_brdf = sheenMix(material.sheenColor, indirect_brdf, sheen_brdf);
    }

    if (material.clearcoatFactor != 0.0) {
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
      indirect_brdf = fresnelMix(
        clearcoatF0,
        clearcoatF90,
        clearcoatVdotH,
        material.clearcoatFactor,
        indirect_brdf,
        clearcoat_brdf
      );
    }

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

    vec3 clearcoatIrradiance = directLight.radiance * clearCoatDotNL;

    vec3 diffuse_brdf =
      irradiance * BRDF_Diffuse_Lambert(albedo) * material.occlusion;
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
    direct_brdf = fresnelMix(
      specularF0,
      specularF90,
      VdotH,
      material.specularFactor,
      diffuse_brdf,
      specular_brdf
    );

    // sheen
    if (material.sheenColor != vec3(0.0)) {
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
      direct_brdf = sheenMix(material.sheenColor, direct_brdf, sheen_brdf);
    }

    // clearcoat
    if (material.clearcoatFactor != 0.0) {
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
      direct_brdf = fresnelMix(
        clearcoatF0,
        clearcoatF90,
        VdotH,
        material.clearcoatFactor,
        direct_brdf,
        clearcoat_brdf
      );
    }

    // emissive
    outgoingRadiance += direct_brdf;
  }

  vec3 emissive_brdf = material.emissive;
  outgoingRadiance += emissive_brdf;

  //  outputColor.rgb = tonemappingACESFilmic( linearTosRGB( outgoingRadiance ) );
  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(outgoingRadiance));
  outputColor.a = material.alpha;

}
