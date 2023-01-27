precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

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
  PhysicalMaterial material = readPhysicalMaterialFromUniforms( );

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
  //material.metallic = 0.;
  //material.emissive = vec3( 0. );
  //material.specularRoughness = 0.5;

  for( int i = 0; i < numPunctualLights; i++ ) {
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

// clearcoat
  outgoingRadiance += directLight.radiance *
      clearCoatDotNL *
      BRDF_Specular_GGX( clearcoatNormal, viewDirection, directLight.direction, vec3(0.08), vec3( 1.0 ), material.clearcoatRoughness ) * material.clearcoatFactor;

  float reduction = 1.0 - length( clearcoatF );
    // specular
    outgoingRadiance += reduction * directLight.radiance *
      dotNL *
      BRDF_Specular_GGX( normal, viewDirection, directLight.direction, specularF0, specularF90, material.specularRoughness ) * specularOcclusion( dotNV, material.occlusion, material.specularRoughness );

    // diffuse
    vec3 c_diffuse = directLight.radiance *
      dotNL *
      BRDF_Diffuse_Lambert( material.albedo ) * material.occlusion;

    // metallic
    outgoingRadiance += reduction * mix( c_diffuse, vec3( 0. ), material.metallic );

    // emissive
    outgoingRadiance += material.emissive;
  }

  outputColor.rgb = tonemappingACESFilmic( linearTosRGB( outgoingRadiance ) );
  outputColor.a = material.alpha;

}
