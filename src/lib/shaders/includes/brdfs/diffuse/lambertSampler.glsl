#include <math/sampling/hammersley>
#include <normals/tangentSpace>

vec3 BRDF_Diffuse_Lambert_SampleDirection( vec2 sampleUv ) {
	float phi = PI2 * sampleUv.x;
  float cosTheta = 0.;
	float sinTheta = 0.;

  cosTheta = 1. - sampleUv.y;
  sinTheta = sqrt( 1. - cosTheta*cosTheta );

  return normalize( vec3( sinTheta * cos( phi ), sinTheta * sin( phi ), cosTheta ) );
}

float BRDF_Diffuse_Lambert_PDF(
  const in vec3 normal,
  const in vec3 lightDirection ) {

	float dotNL = saturate( dot( normal, lightDirection ) );
	return dotNL * RECIPROCAL_PI;
}

vec3 sampleIBL( vec3 direction, float lod );

vec3 BRDF_Diffuse_Lambert_Filter(vec3 N, float filterWidth ) {

	vec4 color;
	const float solidAngleTexel = 4. * PI / (6. * pow2( filterWidth );

	for( uint i = 0; i < NUM_SAMPLES; i++ ) {

    vec2 sampleUv = hammersley2( sampleIndex, NUM_SAMPLES );
    vec3 tangentSpaceSampleDirection = BRDF_Diffuse_Lambert_SampleDirection( sampleUv );
    vec3 surfaceSampleDirection = tangentToViewFromNormal( N ) * tangentSpaceSampleDirection;
    vec3 H = surfaceSampleDirection;

		// Note: reflect takes incident vector.
		// Note: N = V
		vec3 V = N;
		vec3 L = normalize( reflect( -V, H ) );

		float dotNL = dot( N, L );

		if ( dotNL > 0. ) {
			float lod = 0.;

      // Mipmap Filtered Samples
      // see https://github.com/derkreature/IBLBaker
      // see https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch20.html
      float pdf = BRDF_Diffuse_Lambert_PDF( N, L );

      float solidAngleSample = 1.0 / ( float( NUM_SAMPLES ) * pdf );

      lod = 0.5 * log2( solidAngleSample / solidAngleTexel );
      lod += LOD_BIAS;

      color += vec4( sampleIBL( H, lod ), 1.0 );
		}
	}

	return color.rgb / color.w;
}
