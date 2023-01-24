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

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    position,
    normal,
    v_uv0
  );
  normal = adjustNormal(tangentToView, material.normal);

  vec3 outgoingRadiance;

  for (int i = 0; i < numPunctualLights; i++) {
    PunctualLight punctualLight = readPunctualLightFromUniforms(i, worldToView);

    DirectLight directLight = punctualLightToDirectLight(
      position,
      punctualLight
    );

    float dotNL = saturate(dot(directLight.direction, normal));

    vec3 specularF90 = mix( vec3( material.specularFactor ),vec3( 1.0 ), material.metallic );
    vec3 specularF0 = mix( material.specularColor, material.albedo, material.metallic );


    outgoingRadiance +=
      directLight.radiance *
      dotNL *
      BRDF_Specular_GGX(
        normal,
        viewDirection,
        directLight.direction,
        specularF0,
        specularF90,
        material.specularRoughness
      );
     vec3 c_diffuse =
      directLight.radiance *
      dotNL *
      BRDF_Diffuse_Lambert(material.albedo);
    outgoingRadiance += mix( c_diffuse, vec3(0.), material.metallic );
  }

  outputColor.rgb = linearTosRGB(outgoingRadiance);
  outputColor.a = 1.0;

}
