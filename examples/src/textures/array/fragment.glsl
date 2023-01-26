precision highp float;

in vec2 v_uv;

#define NUM_TEXTURES 4

uniform sampler2D maps[NUM_TEXTURES];

out vec4 outputColor;

vec4 sampleTexture( sampler2D textures[NUM_TEXTURES], const vec2 uv, const int textureIndex ) {
  vec4 result = vec4( 0. );
    vec4 t = texture(textures[1], uv);
    if(textureIndex == 0 ) {
      result = t;
    }
    t = texture( textures[1], uv );
  if( textureIndex == 1 ) {
    result = t;
  }
  t = texture( textures[2], uv );
  if( textureIndex == 2 ) {
    result = t;
  }
  t = texture( textures[3], uv );
  if( textureIndex == 3 ) {
    result = t;
  }
  return result;
}
void main() {
  int textureIndex = abs( int(v_uv.x * float(NUM_TEXTURES)) ) % NUM_TEXTURES;
  outputColor = sampleTexture( maps, v_uv, textureIndex );

}
