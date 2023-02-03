#pragma once

#pragma include <materials/physical>
#pragma include <textures/textureAccessors>

uniform int alphaMode;
uniform float alphaCutoff;
uniform float alpha;
uniform vec3 albedoFactor;
uniform TextureAccessor albedoAlphaTextureAccessor;

uniform float specularRoughnessFactor;
uniform float metallicFactor;
uniform TextureAccessor metallicSpecularRoughnessTextureAccessor;

uniform vec3 emissiveFactor;
uniform TextureAccessor emissiveTextureAccessor;

uniform vec2 normalScale;
uniform TextureAccessor normalTextureAccessor;

uniform float occlusionFactor;
uniform TextureAccessor occlusionTextureAccessor;

uniform float ior;

uniform float specularFactor;
uniform TextureAccessor specularFactorTextureAccessor;
uniform vec3 specularColor;
uniform TextureAccessor specularColorTextureAccessor;

uniform float clearcoatFactor;
uniform float clearcoatRoughnessFactor;
uniform TextureAccessor clearcoatFactorRoughnessTextureAccessor;
uniform vec2 clearcoatNormalScale;
uniform TextureAccessor clearcoatNormalTextureAccessor;

uniform vec3 sheenColorFactor;
uniform float sheenRoughnessFactor;
uniform TextureAccessor sheenColorRoughnessTextureAccessor;

uniform float iridescenceFactor;
uniform float iridescenceIor;
uniform float iridescenceThicknessMinimum;
uniform float iridescenceThicknessMaximum;
uniform TextureAccessor iridescenceFactorThicknessTextureAccessor;

uniform float transmissionFactor;
uniform float thicknessFactor;
uniform vec3 attenuationColor;
uniform float attenuationDistance;
uniform TextureAccessor transmissionFactorThicknessTextureAccessor;

#pragma include <microgeometry/normalPacking>
#pragma include <color/spaces/srgb>
#pragma include <microgeometry/normalMapping>

PhysicalMaterial readPhysicalMaterialFromUniforms( const vec2 uvs[NUM_UV_CHANNELS] ) {

    PhysicalMaterial material;
    material.alphaMode = alphaMode;
    material.alphaCutoff = alphaCutoff;
    vec4 alebedoAlpha = sampleTexture( albedoAlphaTextureAccessor, uvs );
    material.alpha = alpha * alebedoAlpha.a;
    material.albedo = albedoFactor * sRGBToLinear( alebedoAlpha.rgb );

    vec4 metallicSpecularRoughness = sampleTexture( metallicSpecularRoughnessTextureAccessor, uvs );
    material.specularRoughness = specularRoughnessFactor * metallicSpecularRoughness.g;
    material.metallic = metallicFactor * metallicSpecularRoughness.b;

    material.emissive = emissiveFactor * sRGBToLinear( sampleTexture( emissiveTextureAccessor, uvs ).rgb );
    material.normal = vec3( normalScale, 1.0 ) * rgbToNormal( sampleTexture( normalTextureAccessor, uvs ).rgb );
    material.occlusion = ( sampleTexture( occlusionTextureAccessor, uvs ).r - 1.0 ) * occlusionFactor + 1.0;
    
    // https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_ior/README.md
    material.ior = ior;

    // https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_specular/README.md
    material.specularFactor = specularFactor * sampleTexture( specularFactorTextureAccessor, uvs ).r;
    material.specularColor = specularColor * sRGBToLinear( sampleTexture( specularColorTextureAccessor, uvs ).rgb );
    
    // https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_clearcoat/README.md
    vec4 clearcoatFactorRoughness = sampleTexture( clearcoatFactorRoughnessTextureAccessor, uvs );
    material.clearcoatFactor = clearcoatFactor * clearcoatFactorRoughness.r;
    material.clearcoatRoughness = clearcoatRoughnessFactor * clearcoatFactorRoughness.g;
    material.clearcoatNormal = vec3( clearcoatNormalScale, 1.0 ) * rgbToNormal( sampleTexture( clearcoatNormalTextureAccessor, uvs ).rgb );

    // https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen/README.md
    vec4 sheenColorRoughness = sampleTexture( sheenColorRoughnessTextureAccessor, uvs );
    material.sheenColor = sheenColorFactor * sRGBToLinear( sheenColorRoughness.rgb );
    material.sheenRoughness = sheenRoughnessFactor * sheenColorRoughness.a;
   
    // https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md
    vec4 transmissionFactorThickness = sampleTexture( transmissionFactorThicknessTextureAccessor, uvs );
    material.transmission = transmissionFactor * transmissionFactorThickness.r;
    
    // https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_transmission/README.md
    material.thickness = thicknessFactor * transmissionFactorThickness.g;
    material.attenuationColor = attenuationColor;
    material.attenuationDistance = attenuationDistance;

    // https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_iridescence/README.md
    vec4 iridescenceFactorThickness = sampleTexture( iridescenceFactorThicknessTextureAccessor, uvs );
    material.iridescence = iridescenceFactor * iridescenceFactorThickness.r;
    material.iridescenceIor = iridescenceIor;
    material.iridescenceThickness = mix( iridescenceThicknessMinimum, iridescenceThicknessMaximum, iridescenceFactorThickness.g );

    return material;
}
