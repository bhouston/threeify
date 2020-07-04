precision highp float;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;

uniform samplerCube cubeMap;
uniform float perceptualRoughness;
uniform int mipCount;

vec4 rgbeToLinear( in vec4 value ) {
	return vec4( value.rgb * exp2( value.a * 255. - 128. ), 1. );
}


// reference: http://iwasbeingirony.blogspot.ca/2010/06/difference-between-rgbm-and-rgbd.html
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * ( ( maxRange / 255. ) / value.a ), 1. );
}

vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float D = max( maxRange / maxRGB, 1. );
	// NOTE: The implementation with min causes the shader to not compile on
	// a common Alcatel A502DL in Chrome 78/Android 8.1. Some research suggests
	// that the chipset is Mediatek MT6739 w/ IMG PowerVR GE8100 GPU.
	// D = min( floor( D ) / 255., 1. );
	D = clamp( floor( D ) / 255., 0., 1. );
	return vec4( value.rgb * ( D * ( 255. / maxRange ) ), D );
}

void main() {

  vec3 reflectDir = reflect( normalize( v_viewPosition ),normalize(v_viewNormal) );
  float lod = clamp(perceptualRoughness * float(mipCount), 0., float(mipCount));
  gl_FragColor.rgb = pow( RGBDToLinear(textureCubeLodEXT(cubeMap, reflectDir, lod),16.).rgb, vec3(0.5) );

  gl_FragColor.a = 1.;

}
