#pragma once

#pragma include <materials/physical>

uniform float alpha;
uniform sampler2D alphaTexture;
uniform vec3 albedoFactor;
uniform sampler2D albedoTexture;
uniform float specularFactor;
uniform sampler2D specularFactorTexture;
uniform vec3 specularColor;
uniform sampler2D specularColorTexture;
uniform float specularRoughnessFactor;
uniform sampler2D specularRoughnessTexture;
uniform float metallicFactor;
uniform sampler2D metallicTexture;
uniform vec3 emissiveFactor;
uniform sampler2D emissiveTexture;
uniform vec2 normalScale;
uniform sampler2D normalTexture;
uniform float occlusionFactor;
uniform sampler2D occlusionTexture;
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

PhysicalMaterial readPhysicalMaterialFromUniforms( ) {

    vec2 uv = v_uv0;

    PhysicalMaterial material;
    material.alpha = alpha * texture( alphaTexture, uv ).a;
    material.albedo = albedoFactor * sRGBToLinear( texture( albedoTexture, uv ).rgb );
    material.specularFactor = specularFactor * texture( specularFactorTexture, uv ).r;
    material.specularColor = specularColor * sRGBToLinear( texture( specularColorTexture, uv ).rgb );
    material.specularRoughness = specularRoughnessFactor * texture( specularRoughnessTexture, uv ).g;
    material.metallic = metallicFactor * texture( metallicTexture, uv ).b;
    material.emissive = emissiveFactor * sRGBToLinear( texture( emissiveTexture, uv ).rgb );
    material.normal = vec3( normalScale, 1.0 ) * rgbToNormal( texture( normalTexture, uv ).rgb );
    material.occlusion = ( texture( occlusionTexture, uv ).r - 1.0 ) * occlusionFactor + 1.0;
    material.ior = ior;
    material.clearcoatFactor = clearcoatFactor * texture( clearcoatFactorTexture, uv ).r;
    material.clearcoatRoughness = clearcoatRoughnessFactor * texture( clearcoatRoughnessTexture, uv ).r;
    material.clearcoatNormal = vec3( clearcoatNormalScale, 1.0 ) * rgbToNormal( texture( clearcoatNormalTexture, uv ).rgb );
    material.clearcoatTint = clearcoatTint * sRGBToLinear( texture( clearcoatTintTexture, uv ).rgb );
    material.sheenColor = sheenColorFactor * sRGBToLinear( texture( sheenColorFactorTexture, uv ).rgb );
    material.sheenRoughness = sheenRoughnessFactor * texture( sheenRoughnessFactorTexture, uv ).r;

    return material;
}