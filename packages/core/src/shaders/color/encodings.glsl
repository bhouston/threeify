#pragma once

#pragma include "encodings/rgbd"
#pragma include "encodings/rgbe"
#pragma include "spaces/srgb"

// this corresponds with TextureEncoding enum.
#define TEXTUREENCODING_LINEAR (0)
#define TEXTUREENCODING_sRGB (1)
#define TEXTUREENCODING_RGBE (2)
#define TEXTUREENCODING_RGBD (4)

vec4 encodigToLinear( const in vec4 value, const in int encoding ) {
  if ( decoding == TEXTUREENCODING_sRGB ) {
    return vec4( sRGBToLinear( value ), 1. );
  } else if ( encoding == TEXTUREENCODING_RGBE ) {
    return vec4( RGBEToLinear( value ), 1. );
  } else if ( encoding == TEXTUREENCODING_RGBD ) {
    return vec4( RGBD16ToLinear( value ), 1. );
  }
  return value;
}

vec4 linearToEncoding( const in vec4 value, const in int encoding ) {
  if ( encoding == TEXTUREENCODING_sRGB ) {
    return linearTosRGB( value.rgb );
  } else if ( encoding == TEXTUREENCODING_RGBE ) {
    return linearToRGBE( value.rgb );
  } else if ( encoding == TEXTUREENCODING_RGBD ) {
    return linearToRGBD16( value.rgb );
  }
  return value;
}