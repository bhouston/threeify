precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

#define MAX_PUNCTUAL_LIGHTS (4)
#pragma include <lighting/punctualUniforms>
#pragma include <materials/physicalUniforms>

uniform mat4 worldToView;

out vec4 outputColor;

#pragma include <normals/tangentSpace>
#pragma include <brdfs/diffuse/lambert>
#pragma include <brdfs/specular/ggx>
#pragma include <brdfs/sheen/charlie>
#pragma include <math/mat4>

void main() {
  PhysicalMaterial material = readPhysicalMaterialFromUniforms();

  vec3 clearCoatF0 = specularIntensityToF0(vec3(1.)) * material.clearcoatTint;
 
  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(position, normal, v_uv0);
  vec3 clearcoatNormal = adjustNormal( tangentToView, material.clearcoatNormal );
  normal = adjustNormal( tangentToView, material.normal );

  vec3 outgoingRadiance;

  for(int i = 0; i < numPunctualLights; i++) {
    PunctualLight punctualLight = readPunctualLightFromUniforms( i, worldToView );

    DirectLight directLight = punctualLightToDirectLight(position, punctualLight);

    float dotNL = saturate(dot(directLight.direction, normal));
    float clearcoatDotNL = saturate(dot(directLight.direction, clearcoatNormal));

  // this lack energy conservation.
   outgoingRadiance += directLight.radiance *
      dotNL *
      BRDF_Sheen_Charlie( normal, viewDirection, directLight.direction, material.sheenColor, 0.5, material.sheenRoughness );
    outgoingRadiance += directLight.radiance *
      clearcoatDotNL *
      BRDF_Specular_GGX(clearcoatNormal, viewDirection, directLight.direction, vec3(0.16), vec3(1.), material.clearcoatRoughness);
    outgoingRadiance += (1. - material.clearcoatFactor) * directLight.radiance  *
      dotNL *
      BRDF_Specular_GGX(normal, viewDirection, directLight.direction, material.specularColor * material.specularFactor, material.specularColor, material.specularRoughness);
    outgoingRadiance += (1. - material.clearcoatFactor) * directLight.radiance * dotNL * BRDF_Diffuse_Lambert(material.albedo);

  }

  outputColor.rgb = linearTosRGB(outgoingRadiance);
  outputColor.a = 1.0;

}
