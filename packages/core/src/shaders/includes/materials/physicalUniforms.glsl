#pragma once

#pragma include <materials/physical>
#pragma include <textures/textureAccessors>

uniform int alphaMode;
uniform float alphaCutoff;
uniform float alpha;
uniform TextureAccessor alphaTextureAccessor;

uniform vec3 albedoFactor;
uniform TextureAccessor albedoTextureAccessor;

uniform float specularFactor;
uniform TextureAccessor specularFactorTextureAccessor;

uniform vec3 specularColor;
uniform TextureAccessor specularColorTextureAccessor;

uniform float specularRoughnessFactor;
uniform TextureAccessor specularRoughnessTextureAccessor;

uniform float metallicFactor;
uniform TextureAccessor metallicTextureAccessor;

uniform vec3 emissiveFactor;
uniform TextureAccessor emissiveTextureAccessor;

uniform vec2 normalScale;
uniform TextureAccessor normalTextureAccessor;

uniform float occlusionFactor;
uniform TextureAccessor occlusionTextureAccessor;

uniform float ior;

uniform float clearcoatFactor;
uniform TextureAccessor clearcoatFactorTextureAccessor;
uniform float clearcoatRoughnessFactor;
uniform TextureAccessor clearcoatRoughnessTextureAccessor;
uniform vec2 clearcoatNormalScale;
uniform TextureAccessor clearcoatNormalTextureAccessor;
uniform vec3 clearcoatTint;
uniform TextureAccessor clearcoatTintTextureAccessor;

uniform vec3 sheenColorFactor;
uniform TextureAccessor sheenColorTextureAccessor;
uniform float sheenRoughnessFactor;
uniform TextureAccessor sheenRoughnessTextureAccessor;

uniform float iridescenceFactor;
//uniform TextureAccessor iridescenceFactorTextureAccessor;
uniform float iridescenceIor;
//uniform float iridescenceThicknessMinimum;
//uniform float iridescenceThicknessMaximum;
//uniform TextureAccessor iridescenceThicknessTextureAccessor;

#pragma include <normals/normalPacking>
#pragma include <color/spaces/srgb>
#pragma include <normals/normalMapping>

PhysicalMaterial readPhysicalMaterialFromUniforms( const vec2 uvs[NUM_UV_CHANNELS] ) {

    PhysicalMaterial material;
    material.alphaMode = alphaMode;
    material.alphaCutoff = alphaCutoff;
    material.alpha = alpha * sampleTexture( alphaTextureAccessor, uvs ).a;
    material.albedo = albedoFactor * sRGBToLinear( sampleTexture( albedoTextureAccessor, uvs ).rgb );
    material.specularFactor = specularFactor * sampleTexture( specularFactorTextureAccessor, uvs ).r;
    material.specularColor = specularColor * sRGBToLinear( sampleTexture( specularColorTextureAccessor, uvs ).rgb );
    material.specularRoughness = specularRoughnessFactor * sampleTexture( specularRoughnessTextureAccessor, uvs ).g;
    material.metallic = metallicFactor * sampleTexture( metallicTextureAccessor, uvs ).b;
    material.emissive = emissiveFactor * sRGBToLinear( sampleTexture( emissiveTextureAccessor, uvs ).rgb );
    material.normal = vec3( normalScale, 1.0 ) * rgbToNormal( sampleTexture( normalTextureAccessor, uvs ).rgb );
    material.occlusion = ( sampleTexture( occlusionTextureAccessor, uvs ).r - 1.0 ) * occlusionFactor + 1.0;
    material.ior = ior;

    // https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_clearcoat/README.md
    material.clearcoatFactor = clearcoatFactor * sampleTexture( clearcoatFactorTextureAccessor, uvs ).r;
    material.clearcoatRoughness = clearcoatRoughnessFactor * sampleTexture( clearcoatRoughnessTextureAccessor, uvs ).g;
    material.clearcoatNormal = vec3( clearcoatNormalScale, 1.0 ) * rgbToNormal( sampleTexture( clearcoatNormalTextureAccessor, uvs ).rgb );
    material.clearcoatTint = clearcoatTint * sRGBToLinear( sampleTexture( clearcoatTintTextureAccessor, uvs ).rgb );
    
    // 
    material.sheenColor = sheenColorFactor * sRGBToLinear( sampleTexture( sheenColorTextureAccessor, uvs ).rgb );
    material.sheenRoughness = sheenRoughnessFactor * sampleTexture( sheenRoughnessTextureAccessor, uvs ).a;
    
    //
	material.iridescence = iridescenceFactor; // * sampleTexture( iridescenceFactorTextureAccessor, uvs ).r;
    material.iridescenceIor = iridescenceIor;
   //material.iridescenceThickness = ( iridescenceThicknessMaximum - iridescenceThicknessMinimum ) * sampleTexture( iridescenceThicknessTextureAccessor, uvs ).g + iridescenceThicknessMinimum;

    return material;
}
