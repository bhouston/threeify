#pragma once

#pragma include <materials/physical>

uniform int alphaMode;
uniform float alphaCutoff;
uniform float alpha;
uniform sampler2D alphaTexture;
uniform int alphaUVIndex;
uniform mat3 alphaUVTransform;
uniform vec3 albedoFactor;
uniform sampler2D albedoTexture;
uniform mat3 albedoUVTransform;
uniform int albedoUVIndex;
uniform float specularFactor;
uniform sampler2D specularFactorTexture;
uniform vec3 specularColor;
uniform sampler2D specularColorTexture;
uniform float specularRoughnessFactor;
uniform sampler2D specularRoughnessTexture;
uniform mat3 specularRoughnessUVTransform;
uniform int specularRoughnessUVIndex;
uniform float metallicFactor;
uniform sampler2D metallicTexture;
uniform mat3 metallicUVTransform;
uniform int metallicUVIndex;
uniform vec3 emissiveFactor;
uniform sampler2D emissiveTexture;
uniform vec2 normalScale;
uniform sampler2D normalTexture;
uniform mat3 normalUVTransform;
uniform int normalUVIndex;
uniform float occlusionFactor;
uniform sampler2D occlusionTexture;
uniform mat3 occlusionUVTransform;
uniform int occlusionUVIndex;
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

vec2 transformUV( const vec2 uv, const mat3 uvTransform ) {
    return ( uvTransform * vec3( uv, 1.0 ) ).xy;
}

PhysicalMaterial readPhysicalMaterialFromUniforms( const vec2 uvs[3] ) {

    vec2 uv = uvs[0];

    PhysicalMaterial material;
    material.alphaMode = alphaMode;
    material.alphaCutoff = alphaCutoff;
    material.alpha = alpha * texture( alphaTexture,  transformUV( uvs[alphaUVIndex], alphaUVTransform )).a;
    material.albedo = albedoFactor * sRGBToLinear( texture( albedoTexture, transformUV( uvs[ albedoUVIndex ], albedoUVTransform) ).rgb );
    material.specularFactor = specularFactor * texture( specularFactorTexture, uv ).r;
    material.specularColor = specularColor * sRGBToLinear( texture( specularColorTexture, uv ).rgb );
    material.specularRoughness = specularRoughnessFactor * texture( specularRoughnessTexture,  transformUV( uvs[specularRoughnessUVIndex], specularRoughnessUVTransform) ).g;
    material.metallic = metallicFactor * texture( metallicTexture, transformUV( uvs[metallicUVIndex], metallicUVTransform ) ).b;
    material.emissive = emissiveFactor * sRGBToLinear( texture( emissiveTexture, uv ).rgb );
    material.normal = vec3( normalScale, 1.0 ) * rgbToNormal( texture( normalTexture, transformUV( uvs[normalUVIndex], normalUVTransform ) ).rgb );
    material.occlusion = ( texture( occlusionTexture, transformUV( uvs[occlusionUVIndex], occlusionUVTransform ) ).r - 1.0 ) * occlusionFactor + 1.0;
    material.ior = ior;
    material.clearcoatFactor = clearcoatFactor * texture( clearcoatFactorTexture, uv ).r;
    material.clearcoatRoughness = clearcoatRoughnessFactor * texture( clearcoatRoughnessTexture, uv ).r;
    material.clearcoatNormal = vec3( clearcoatNormalScale, 1.0 ) * rgbToNormal( texture( clearcoatNormalTexture, uv ).rgb );
    material.clearcoatTint = clearcoatTint * sRGBToLinear( texture( clearcoatTintTexture, uv ).rgb );
    material.sheenColor = sheenColorFactor * sRGBToLinear( texture( sheenColorFactorTexture, uv ).rgb );
    material.sheenRoughness = sheenRoughnessFactor * texture( sheenRoughnessFactorTexture, uv ).r;

    return material;
}
