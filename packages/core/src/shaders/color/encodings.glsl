#pragma once

#pragma include "encodings/rgbd"
#pragma include "encodings/rgbe"
#pragma include "spaces/srgb"

// this corresponds with TextureEncoding enum.
#define TEXTUREENCODING_LINEAR (0)
#define TEXTUREENCODING_sRGB (1)
#define TEXTUREENCODING_RGBE (2)
#define TEXTUREENCODING_RGBD (4)

vec4 encodingToLinear( const in vec4 value, const in int encoding ) {
  if ( encoding == TEXTUREENCODING_sRGB ) {
    return vec4( sRGBToLinear( value.rgb ), 1. );
  } else if ( encoding == TEXTUREENCODING_RGBE ) {
    return vec4( rgbeToLinear( value ), 1. );
  } else if ( encoding == TEXTUREENCODING_RGBD ) {
    return vec4( rgbdToLinear( value, 16. ), 1. );
  }
  return value;
}

vec4 linearToEncoding( const in vec4 value, const in int encoding ) {
  if ( encoding == TEXTUREENCODING_sRGB ) {
    return vec4( linearTosRGB( value.rgb ), 1. );
  } else if ( encoding == TEXTUREENCODING_RGBE ) {
    return linearToRGBE( value.rgb );
  } else if ( encoding == TEXTUREENCODING_RGBD ) {
    return linearToRGBD( value.rgb, 16. );
  }
  return value;
}