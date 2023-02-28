precision highp float;

#define NUM_UV_CHANNELS (1)

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

#define MAX_PUNCTUAL_LIGHTS (4)
#pragma import "@threeify/core/dist/shaders/lighting/punctualUniforms.glsl"
#pragma import "@threeify/core/dist/shaders/materials/physicalUniforms.glsl"

uniform mat4 worldToView;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/microgeometry/tangentSpace.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/diffuse/lambert.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/specular/ggx.glsl"
#pragma import "@threeify/core/dist/shaders/brdfs/sheen/charlie.glsl"
#pragma import "@threeify/core/dist/shaders/math/mat4.glsl"

void main() {
  vec2 uvs[NUM_UV_CHANNELS];
  uvs[0] = v_uv0;

  PhysicalMaterial material = readPhysicalMaterialFromUniforms(uvs);

  vec3 dielectricSpecularF0 =
    min(pow2((ior - 1.0) / (ior + 1.0)), 1.0) *
    material.specularColor *
    material.specularFactor;
  vec3 dielectricSpecularF90 = vec3(material.specularFactor);
  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(
    position,
    normal,
    v_uv0
  );
  vec3 clearcoatNormal = adjustNormal(tangentToView, material.clearcoatNormal);
  normal = adjustNormal(tangentToView, material.normal);

  vec3 outgoingRadiance;

  for (int i = 0; i < numPunctualLights; i++) {
    PunctualLight punctualLight = readPunctualLightFromUniforms(i, worldToView);

    DirectLight directLight = punctualLightToDirectLight(
      position,
      punctualLight
    );

    float dotNL = saturate(dot(directLight.direction, normal));
    float clearcoatDotNL = saturate(
      dot(directLight.direction, clearcoatNormal)
    );

    // this lack energy conservation.
    outgoingRadiance +=
      directLight.radiance *
      dotNL *
      BRDF_Sheen_Charlie(
        normal,
        viewDirection,
        directLight.direction,
        material.sheenColor,
        material.sheenRoughness
      );
    outgoingRadiance +=
      directLight.radiance *
      clearcoatDotNL *
      BRDF_Specular_GGX(
        clearcoatNormal,
        viewDirection,
        directLight.direction,
        vec3(0.04) * material.clearcoatTint * material.clearcoatFactor,
        vec3(1.0) * material.clearcoatFactor,
        material.clearcoatRoughness
      );
    outgoingRadiance +=
      directLight.radiance *
      dotNL *
      BRDF_Specular_GGX(
        normal,
        viewDirection,
        directLight.direction,
        dielectricSpecularF0,
        dielectricSpecularF90,
        material.specularRoughness
      );
    vec3 c_diffuse =
      directLight.radiance * dotNL * BRDF_Diffuse_Lambert(material.albedo);
    outgoingRadiance += mix(c_diffuse, vec3(0.0), material.metallic);
  }

  outputColor.rgb = linearTosRGB(outgoingRadiance);
  outputColor.a = 1.0;

}
