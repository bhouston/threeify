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

#pragma include <normals/tangentSpace>
#pragma include <brdfs/diffuse/lambert>

#pragma include <brdfs/specular/ggx>
#pragma include <brdfs/sheen/charlie>
#pragma include <math/mat4>
#pragma include <operations/occlusion>
#pragma include <operations/tonemapping>
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
  vec3 normal = normalize( v_viewSurfaceNormal );
  vec3 viewDirection = normalize( -v_viewSurfacePosition );

  mat3 tangentToView = tangentToViewFromPositionNormalUV( position, normal, v_uv0 );
  normal = adjustNormal( tangentToView, material.normal );
  vec3 clearcoatNormal = adjustNormal( tangentToView, material.clearcoatNormal );

  vec3 outgoingRadiance;

  //material.albedo = vec3( 1. );
  //material.occlusion = 1.;
  //material.metallic = 0.;
  //material.emissive = vec3( 0. );
  //material.specularRoughness = 0.5;

  // note: this for loop pattern is faster than using numPunctualLights as a loop condition
  for( int i = 0; i < MAX_PUNCTUAL_LIGHTS; i++ ) {
    if( i >= numPunctualLights ) {
      break;
    }
    PunctualLight punctualLight = readPunctualLightFromUniforms( i, worldToView );

    DirectLight directLight = punctualLightToDirectLight( position, punctualLight );

    float clearCoatDotNL = saturate( dot( directLight.direction, clearcoatNormal ) );
    float dotNL = saturate( dot( directLight.direction, normal ) );
    float dotNV = saturate( dot( viewDirection, normal ) );

    vec3 halfDirection = normalize( directLight.direction + viewDirection );
    float VdotH = saturate( dot( viewDirection, halfDirection ) );

    vec3 specularF90 = mix( vec3( material.specularFactor ), vec3( 1.0 ), material.metallic );
    vec3 specularF0 = mix( material.specularColor * 0.04, material.albedo, material.metallic );

    vec3 clearcoatF = F_Schlick_2( vec3( 0.08 ), vec3( 1.0 ), VdotH ) * material.clearcoatFactor;

    vec3 irradiance = directLight.radiance * dotNL;
 
    float reduction = 1.0; // - length( material.sheenColor );
   
    // clearcoat
    outgoingRadiance += reduction * directLight.radiance *
      clearCoatDotNL *
      BRDF_Specular_GGX( clearcoatNormal, viewDirection, directLight.direction, vec3( 0.08 ), vec3( 1.0 ), material.clearcoatRoughness ) * material.clearcoatFactor;

    // sheen
    outgoingRadiance += reduction * irradiance *
      BRDF_Sheen_Charlie( normal, viewDirection, directLight.direction, material.sheenColor, material.sheenRoughness );

    reduction *= (1.0 - material.clearcoatFactor);

    // iridescence
    // outgoingRadiance += reduction * irradiance * BRDF_GGX_Iridescence( normal, viewDirection, directLight.direction, specularF0, specularF90, material.iridescence, material.iridescenceIor, material.iridescenceThickness. material.specularRoughness);

    // specular
    outgoingRadiance += reduction * irradiance *
      BRDF_Specular_GGX( normal, viewDirection, directLight.direction, specularF0, specularF90, material.specularRoughness ) * specularOcclusion( dotNV, material.occlusion, material.specularRoughness );

    // diffuse + metallic
    outgoingRadiance += reduction * irradiance * mix( BRDF_Diffuse_Lambert( material.albedo ) * material.occlusion, vec3( 0. ), material.metallic );

    // emissive
    outgoingRadiance += material.emissive;
  }

  outputColor.rgb = tonemappingACESFilmic( linearTosRGB( outgoingRadiance ) );
  outputColor.a = material.alpha;

}
