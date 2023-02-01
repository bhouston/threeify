precision highp float;

#define NUM_UV_CHANNELS 3

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;
in vec2 v_uv1;
in vec2 v_uv2;

#define MAX_PUNCTUAL_LIGHTS (3)
#pragma include <lighting/punctualUniforms>
#pragma include <materials/physicalUniforms>

uniform mat4 worldToView;

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

void main( ) {
  vec2 uvs[NUM_UV_CHANNELS];
  uvs[0] = v_uv0;
  uvs[1] = v_uv1;
  uvs[2] = v_uv2;

  PhysicalMaterial material = readPhysicalMaterialFromUniforms( uvs );

  if( material.alphaMode == ALPHAMODE_MASK && material.alpha < material.alphaCutoff ) {
    discard;
  }
  vec3 position = v_viewSurfacePosition;
  vec3 viewNormal = normalize( v_viewSurfaceNormal );
  vec3 viewDirection = normalize( -v_viewSurfacePosition );

  mat3 tangentToView = tangentToViewFromPositionNormalUV( position, viewNormal, v_uv0 );
  viewNormal = adjustNormal( tangentToView, material.normal );
  vec3 viewClearcoatNormal = adjustNormal( tangentToView, material.clearcoatNormal );

  vec3 outgoingRadiance;

  //material.albedo = vec3( 1. );
  //material.occlusion = 1.;
  //material.metallic = 0.;
  //material.emissive = vec3( 0. );
  //material.specularRoughness = 0.5;

  // validated from https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_ior/README.md
  vec3 specularF0 = saturate( iorToF0( material.ior ) * material.specularColor ) * material.specularFactor;
  vec3 specularF90 = vec3( material.specularFactor );

  // validated from https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_specular/README.md
  specularF0 = mix( specularF0, material.albedo, material.metallic );
  specularF90 = mix( specularF90, vec3( 1. ), material.metallic );

  vec3 clearcoatF0 = vec3(0.04);
  vec3 clearcoatF90 = vec3(1.);

  {
 
    vec3 iblIrradiance = sampleIBLIrradiance( iblMapTexture, iblMapIntensity, iblMapMaxLod, viewNormal, worldToView );
    vec3 iblRadiance = sampleIBLRradiance( iblMapTexture, iblMapIntensity, iblMapMaxLod, viewNormal, viewDirection, worldToView, material.specularRoughness );
    vec3 iblClearcoatRadiance = sampleIBLRradiance( iblMapTexture, iblMapIntensity, iblMapMaxLod, viewClearcoatNormal, viewDirection, worldToView, material.clearcoatRoughness );

    // lambert diffuse
    vec3 diffuse_brdf = material.albedo * iblIrradiance;

    // specular layer
    vec3 singleScattering = vec3( 0. ), multiScattering = vec3( 0. );
    BRDF_Specular_GGX_Multiscatter_IBL( viewNormal, viewDirection, specularF0, specularF90, material.specularRoughness, singleScattering, multiScattering );
    vec3 specular_brdf = iblRadiance * singleScattering + multiScattering * iblIrradiance;
    vec3 dielectric_brdf = diffuse_brdf * ( 1. - max3( singleScattering + multiScattering ) ) + specular_brdf;

    // sheen
    vec3 sheen_brdf = iblIrradiance * BRDF_Sheen_Charlie_IBL( viewNormal, viewDirection, material.sheenColor, material.sheenRoughness );
    vec3 fabric_brdf = sheenMix( material.sheenColor, dielectric_brdf, sheen_brdf );

    vec3 clearcoatHalfDirection = normalize( viewClearcoatNormal + viewDirection );
    float clearcoatVdotH = saturate( dot( viewDirection, clearcoatHalfDirection ) );

    // clearcoat
    vec3 clearcoat_brdf = iblClearcoatRadiance * BRDF_Specular_GGX_IBL( viewClearcoatNormal, viewDirection, clearcoatF0, clearcoatF90, material.clearcoatRoughness );
    vec3 coated_brdf = fresnelMix( clearcoatF0, clearcoatF90, clearcoatVdotH, material.clearcoatFactor, fabric_brdf, clearcoat_brdf );

    outgoingRadiance += coated_brdf;
  }

/*

  // note: this for loop pattern is faster than using numPunctualLights as a loop condition
  for( int i = 0; i < MAX_PUNCTUAL_LIGHTS; i++ ) {
    if( i >= numPunctualLights ) {
      break;
    }
    PunctualLight punctualLight = readPunctualLightFromUniforms( i, worldToView );

    DirectLight directLight = punctualLightToDirectLight( position, punctualLight );

    float clearCoatDotNL = saturate( dot( directLight.direction, viewClearcoatNormal ) );
    float dotNL = saturate( dot( directLight.direction, viewNormal ) );
    float dotNV = saturate( dot( viewDirection, viewNormal ) );

    vec3 halfDirection = normalize( directLight.direction + viewDirection );
    float VdotH = saturate( dot( viewDirection, halfDirection ) );

    vec3 irradiance = directLight.radiance * dotNL;

    vec3 clearcoatIrradiance = directLight.radiance * clearCoatDotNL;

    vec3 emissive_brdf = material.emissive;

    vec3 diffuse_brdf = irradiance * mix( BRDF_Diffuse_Lambert( material.albedo ) * material.occlusion, vec3( 0. ), material.metallic );

    vec3 specular_brdf = irradiance * BRDF_Specular_GGX_NoFrenel( viewNormal, viewDirection, directLight.direction, material.specularRoughness ) *
      specularOcclusion( dotNV, material.occlusion, material.specularRoughness );
    vec3 dielectric_brdf = fresnelMix( specularF0, specularF90, VdotH, material.specularFactor, diffuse_brdf, specular_brdf );

    dielectric_brdf += emissive_brdf;

    // sheen
    vec3 sheen_brdf = irradiance * BRDF_Sheen_Charlie( viewNormal, viewDirection, directLight.direction, material.sheenColor, material.sheenRoughness );
    vec3 fabric_brdf = sheenMix( material.sheenColor, dielectric_brdf, sheen_brdf );

    // clearcoat
    vec3 clearcoat_brdf = clearcoatIrradiance *
      BRDF_Specular_GGX_NoFrenel( viewClearcoatNormal, viewDirection, directLight.direction, material.clearcoatRoughness );
    vec3 coated_brdf = fresnelMix( clearcoatF0, clearcoatF90, VdotH, material.clearcoatFactor, fabric_brdf, clearcoat_brdf );

    // emissive
    outgoingRadiance += coated_brdf; // coated_brdf;
  }*/

  outputColor.rgb = tonemappingACESFilmic( linearTosRGB( outgoingRadiance ) );
  outputColor.a = material.alpha;

}
