precision highp float;

in vec3 v_viewSurfacePosition;
in vec3 v_viewSurfaceNormal;
in vec2 v_uv0;

#define MAX_PUNCTUAL_LIGHTS (4)
uniform int numPunctualLights;
uniform int punctualLightType[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightWorldPosition[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightWorldDirection[MAX_PUNCTUAL_LIGHTS];
uniform vec3 punctualLightColor[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightRange[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightInnerCos[MAX_PUNCTUAL_LIGHTS];
uniform float punctualLightOuterCos[MAX_PUNCTUAL_LIGHTS];

uniform float alpha;
uniform sampler2D alphaTexture;
uniform vec3 albedo;
uniform sampler2D albedoTexture;
uniform float specularFactor;
uniform sampler2D specularFactorTexture;
uniform vec3 specularColor;
uniform sampler2D specularColorTexture;
uniform float specularRoughness;
uniform sampler2D specularRoughnessTexture;
uniform float metallic;
uniform sampler2D metallicTexture;
uniform vec3 emissive;
uniform sampler2D emissiveTexture;
uniform float ior;
uniform float clearcoatFactor;
uniform sampler2D clearcoatFactorTexture;
uniform float clearcoatRoughnessFactor;
uniform sampler2D clearcoatRoughnessTexture;
uniform vec2 clearcoatNormalScale;
uniform sampler2D clearcoatNormalTexture;
uniform vec3 clearcoatTint;
uniform sampler2D clearcoatTintTexture;
uniform vec3 sheenColorFactor;
uniform sampler2D sheenColorFactorTexture;
uniform float sheenRoughnessFactor;
uniform sampler2D sheenRoughnessFactorTexture;

uniform mat4 worldToView;

out vec4 outputColor;

#pragma include <lighting/punctual>
#pragma include <brdfs/diffuse/lambert>
#pragma include <color/spaces/srgb>
#pragma include <math/mat4>
#pragma include <brdfs/specular/ggx>
#pragma include <materials/physical>
#pragma include <normals/normalPacking>
#pragma include <normals/tangentSpace>

void main() {
  PhysicalMaterial material;
  material.alpha = alpha * texture(alphaTexture, v_uv0).r;
  material.albedo = albedo * sRGBToLinear(texture(albedoTexture, v_uv0).rgb);
  material.specularFactor = specularFactor * texture(specularFactorTexture, v_uv0).r;
  material.specularColor = specularColor * sRGBToLinear(texture(specularColorTexture, v_uv0).rgb);
  // combine roughness + metallic + occlusion textures.
  material.specularRoughness = specularRoughness * texture(specularRoughnessTexture, v_uv0).r;
  material.metallic = metallic * texture(metallicTexture, v_uv0).r;
  material.emissive = emissive * sRGBToLinear(texture(emissiveTexture, v_uv0).rgb);
  material.ior = ior;
  material.clearcoatFactor = clearcoatFactor * texture(clearcoatFactorTexture, v_uv0).r;
  material.clearcoatRoughness = clearcoatRoughnessFactor * texture(clearcoatRoughnessTexture, v_uv0).r;
  material.clearcoatTint = clearcoatTint * sRGBToLinear(texture(clearcoatTintTexture, v_uv0).rgb);
  material.sheenColor = sheenColorFactor * sRGBToLinear(texture(sheenColorFactorTexture, v_uv0).rgb);
  material.sheenRoughness = sheenRoughnessFactor * texture(sheenRoughnessFactorTexture, v_uv0).r;

  vec3 clearcoatNormalDelta = vec3(clearcoatNormalScale, 1.0) * rgbToNormal(texture(clearcoatNormalTexture, v_uv0).rgb);


 vec3 clearCoatF0 = specularIntensityToF0(vec3(1.)) * material.clearcoatTint;
 

  vec3 position = v_viewSurfacePosition;
  vec3 normal = normalize(v_viewSurfaceNormal);
  vec3 viewDirection = normalize(-v_viewSurfacePosition);

  mat3 tangentToView = tangentToViewFromPositionNormalUV(position, normal, v_uv0);
  tangentToView *= mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), normalize(clearcoatNormalDelta));
  vec3 clearcoatNormal = tangentToView[2];

  vec3 outgoingRadiance;

  for(int i = 0; i < numPunctualLights; i++) {
    PunctualLight punctualLight;
    punctualLight.type = punctualLightType[i];
    punctualLight.position = mat4TransformPosition(worldToView, punctualLightWorldPosition[i]);
    punctualLight.direction = mat4TransformDirection(worldToView, punctualLightWorldDirection[i]);
    punctualLight.intensity = punctualLightColor[i];
    punctualLight.range = punctualLightRange[i];
    punctualLight.innerConeCos = punctualLightInnerCos[i];
    punctualLight.outerConeCos = punctualLightOuterCos[i];

    DirectLight directLight = punctualLightToDirectLight(position, punctualLight);

    float dotNL = saturate(dot(directLight.direction, normal));
    float clearcoatDotNL = saturate(dot(directLight.direction, clearcoatNormal));

  // this lack energy conservation.
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
