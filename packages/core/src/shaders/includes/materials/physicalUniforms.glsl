#pragma once

#pragma include <materials/physical>

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
uniform vec2 normalScale;
uniform sampler2D normalTexture;
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

#pragma include <normals/normalPacking>
#pragma include <color/spaces/srgb>
#pragma include <normals/normalMapping>

PhysicalMaterial readPhysicalMaterialFromUniforms() {

    PhysicalMaterial material;
    material.alpha = alpha * texture( alphaTexture, v_uv0 ).r;
    material.albedo = albedo * sRGBToLinear( texture( albedoTexture, v_uv0 ).rgb );
    material.specularFactor = specularFactor * texture( specularFactorTexture, v_uv0 ).r;
    material.specularColor = specularColor * sRGBToLinear( texture( specularColorTexture, v_uv0 ).rgb );
    material.specularRoughness = specularRoughness * texture( specularRoughnessTexture, v_uv0 ).r;
    material.metallic = metallic * texture( metallicTexture, v_uv0 ).r;
    material.emissive = emissive * sRGBToLinear( texture( emissiveTexture, v_uv0 ).rgb );
    material.normal = vec3( normalScale, 1.0 ) * rgbToNormal( texture( normalTexture, v_uv0 ).rgb );
    material.ior = ior;
    material.clearcoatFactor = clearcoatFactor * texture( clearcoatFactorTexture, v_uv0 ).r;
    material.clearcoatRoughness = clearcoatRoughnessFactor * texture( clearcoatRoughnessTexture, v_uv0 ).r;
    material.clearcoatNormal = vec3( clearcoatNormalScale, 1.0 ) * rgbToNormal( texture( clearcoatNormalTexture, v_uv0 ).rgb );
    material.clearcoatTint = clearcoatTint * sRGBToLinear( texture( clearcoatTintTexture, v_uv0 ).rgb );
    material.sheenColor = sheenColorFactor * sRGBToLinear( texture( sheenColorFactorTexture, v_uv0 ).rgb );
    material.sheenRoughness = sheenRoughnessFactor * texture( sheenRoughnessFactorTexture, v_uv0 ).r;

    return material;
}