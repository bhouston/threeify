#pragma once
#pragma include <math>

// In the future, I could likely pack these ints a bit, but for now this seems okay:
//  int uvIndex : 2 ( up to 4 uv channels )
//  int uvTransformIndex : 4 ( up to 16 uv transforms )
//  int textureIndex : 4 or 5 ( up to 16 textures )
//  int textureComponent : 2 ( x / y / z / w )
// Total : 12 bits.( one single int is sufficient, instead of 4 )

struct TextureAccessor {
    sampler2D texture;
    mat3 uvTransform;
    int uvIndex; // 0, 1, 2
    // int textureEncoding; - let's try to avoid implementing this for now.
};


vec4 sampleTexture( const TextureAccessor textureAccessor, const vec2 uvs[NUM_UV_CHANNELS] ) {
    return texture( textureAccessor.texture,  mat3TransformUV( textureAccessor.uvTransform, uvs[textureAccessor.uvIndex] ) );
}

struct ComponentTextureAccessor {
    sampler2D texture;
    mat3 uvTransform;
    int uvIndex; // 0, 1, 2
    int textureComponent;
    // int textureEncoding; - let's try to avoid implementing this for now.
};

float sampleTextureComponent( const ComponentTextureAccessor textureAccessor, const vec2 uvs[NUM_UV_CHANNELS] ) {
    return texture( textureAccessor.texture, mat3TransformUV( textureAccessor.uvTransform, uvs[textureAccessor.uvIndex] ) )[textureAccessor.textureComponent];
}
