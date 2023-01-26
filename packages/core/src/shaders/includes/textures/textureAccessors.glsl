#pragma once

// In the future, I could likely pack these ints a bit, but for now this seems okay:
//  int uvIndex : 2 ( up to 4 uv channels )
//  int uvTransformIndex : 4 ( up to 16 uv transforms )
//  int textureIndex : 4 or 5 ( up to 16 textures )
//  int textureComponent : 2 ( x / y / z / w )
// Total : 12 bits.( one single int is sufficient, instead of 4 )

struct TextureAccessor {
    int uvIndex; // 0, 1, 2
    int uvTransformIndex;
    int textureIndex;
        // int textureEncoding; - let's try to avoid implementing this for now.
    int textureComponent; // not always used.
};

vec4 sampleTexture( const TextureAccessor textureAccessor, const vec2 uvs[], const mat3 uvTransforms[], const sampler textures[] ) {
    return texture( textures[textureAccessor.textureIndex], uvTransforms[textureAccessor.uvTransformIndex] * uvs[textureAccessor.uvIndex] );
}

float sampleTextureComponent( const TextureAccessor textureAccessor, const vec2 uvs[], const mat3 uvTransforms[], const sampler textures[] ) {
    return sampleTexture( textureAccessor, uvs, uvTransforms, textures )[textureAccessor.textureComponent];
}
