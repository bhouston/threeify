#pragma include <math/math>
#pragma include <math/sampling/hammersley.glsl>
#pragma include <brdfs/specular/d_ggx> // NOTE: takes alpha, original versions here took roughness
#pragma include <brdfs/sheen/d_charlie>
#pragma include <microgeometry/tangentSpace.glsl>

#define NUM_SAMPLES (1024)
#define LOD_BIAS (1)

#define DISTRIBUTION_LAMBERTIAN (0)
#define DISTRIBUTION_GGX (1)
#define DISTRIBUTION_CHARLIE (2)

vec3 BRDF_Diffuse_Lambert_SampleDirection(vec2 sampleUv) {
  float phi = PI2 * sampleUv.x;
  float cosTheta = 0.;
  float sinTheta = 0.;

  cosTheta = 1. - sampleUv.y;
  sinTheta = sqrt(1. - cosTheta * cosTheta);

  return normalize(vec3(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta));
}

vec3 BRDF_Specular_GGX_SampleDirection(vec2 sampleUv) {
  float phi = PI2 * sampleUv.x;
  float cosTheta = 0.;
  float sinTheta = 0.;

  float alphaRoughness = pow2(roughness);
  cosTheta = sqrt(
    (1. - sampleUv.y) / (1. + (pow2(alphaRoughness) - 1.) * sampleUv.y)
  );
  sinTheta = sqrt(1. - pow2(cosTheta));

  return normalize(vec3(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta));
}

vec3 BRDF_Specular_GGX_SampleDirection(vec2 sampleUv) {
  float phi = PI2 * sampleUv.x;
  float cosTheta = 0.;
  float sinTheta = 0.;

  float alphaRoughness = pow2(roughness);
  sinTheta = pow(sampleUv.y, alphaRoughness / (2. * alphaRoughness + 1.));
  cosTheta = sqrt(1. - pow2(sinTheta));

  return normalize(vec3(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta));
}

/*

vec3 getImportanceSample(uint distributionType, uint sampleIndex, vec3 N, float roughness) {

  float u = float(sampleIndex) / float(NUM_SAMPLES);
	float v = hammersley(sampleIndex);

	float phi = PI2 * u;
  float cosTheta = 0.;
	float sinTheta = 0.;

	if( distributionType == DISTRIBUTION_LAMBERTIAN ) {
		cosTheta = 1. - v;
		sinTheta = sqrt( 1. - cosTheta*cosTheta );
	}

  else if( distributionType == DISTRIBUTION_GGX ) {
		float alphaRoughness = pow2( roughness );
		cosTheta = sqrt( ( 1. - v ) / ( 1. + ( pow2( alphaRoughness ) - 1. ) * v ) );
		sinTheta = sqrt( 1. - pow2( cosTheta ) );
	}

  else if( distributionType == DISTRIBUTION_CHARLIE ) {
		float alphaRoughness = pow2( roughness );
		sinTheta = pow( v, alphaRoughness / ( 2.*alphaRoughness + 1. ) );
		cosTheta = sqrt( 1. - pow2( sinTheta ) );
	}

	vec3 sampleDirection = normalize( vec3( sinTheta * cos( phi ), sinTheta * sin( phi ), cosTheta ) );
  mat3 tangentToView = tangentToViewFromNormal( surfaceNormal );

	return tangentToView * sampleDirection;
}*/

float BRDF_Specular_GGX_PDF(
  const vec3 normal,
  const vec3 viewDirection,
  const vec3 halfDirection,
  const float roughness
) {
  float dotVH = saturate(dot(viewDirection, halfDirection));
  float NdotH = saturate(dot(normal, halfDirection));
  float alpha = pow2(roughness);
  float D = D_GGX(alpha, NdotH);
  return max(D * NdotH / (4. * dotVH), 0.);
}

float BRDF_Sheen_Charlie_PDF(
  const vec3 normal,
  const vec3 viewDirection,
  const vec3 halfDirection,
  const float sheenRoughness
) {
  float dotVH = saturate(dot(viewDirection, halfDirection));
  float NdotH = saturate(dot(normal, halfDirection));
  float D = D_Charlie(sheenRoughness, NdotH);
  return max(D * NdotH / (4. * dotVH), 0.);
}

/*
float PDF(uint distributionType, vec3 V, vec3 H, vec3 N, vec3 L, float roughness) {

  if( distributionType == DISTRIBUTION_LAMBERTIAN ) {
		float NdotL = dot( N, L );
		return max( NdotL * RECIPROCAL_PI, 0. );
	}

  else if( distributionType == DISTRIBUTION_GGX ) {
		float dotVH = saturate( dot( V, H ) );
		float NdotH = saturate( dot( N, H ) );
    float alpha = pow2( roughness );

		float D = D_GGX( alpha, NdotH );
		return max( D * dotVH / ( 4. * dotVH ), 0.);
	}

  else if( distributionType == DISTRIBUTION_CHARLIE ) {
		float dotVH = saturate( dot( V, H ) );
		float NdotH = saturate( dot( N, H ) );

		float D = D_Charlie( roughness, NdotH );
		return max( D * dotVH / ( 4. * dotVH ), 0. );
	}

	return 0.;
}*/

/*
vec3 filterColor(uint distributionType, vec3 N, float roughness, float filterWidth ) {

	vec4 color = vec4(0.f);
	const float solidAngleTexel = 4. * PI / (6. * pow2( filterWidth );

	for( uint i = 0; i < NUM_SAMPLES; i++ ) {

		vec3 H = getImportanceSample(distributionType, i, N, roughness);
		// Note: reflect takes incident vector.
		// Note: N = V
		vec3 V = N;
		vec3 L = normalize(reflect(-V, H));

		float NdotL = dot(N, L);

		if ( NdotL > 0. ) {
			float lod = 0.;

			if ( roughness > 0. || distributionType == DISTRIBUTION_LAMBERTIAN ) {
				// Mipmap Filtered Samples
				// see https://github.com/derkreature/IBLBaker
				// see https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch20.html
				float pdf = PDF( distributionType, V, H, N, L, roughness );

				float solidAngleSample = 1. / ( float( NUM_SAMPLES ) * pdf );

				lod = 0.5 * log2( solidAngleSample / solidAngleTexel );
				lod += LOD_BIAS;
			}

			if(distributionType == DISTRIBUTION_LAMBERTIAN) {
				color += vec4( sampleIBL( H, lod ), 1. );
			}
			else {
				color += vec4( sampleIBL( L, lod ) * NdotL, NdotL );
			}
		}
	}

	if(color.w == 0.f)
	{
		return color.rgb;
	}

	return color.rgb / color.w;
}

*/
#pragma include <brdfs/specular/v_ggx_smithcorrelated>  // NOTE: takes alpha, original versions here took roughness
#pragma include <brdfs/sheen/v_charlie>

// Compute LUT for GGX distribution.
// See https://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
vec3 LUT(uint distributionType, float NdotV, float roughness) {
  // Compute spherical view vector: (sin(phi), 0, cos(phi))
  vec3 V = vec3(sqrt(1. - NdotV * NdotV), 0., NdotV);

  // The macro surface normal just points up.
  vec3 N = vec3(0., 0., 1.);

  // To make the LUT independant from the material's F0, which is part of the Fresnel term
  // when substituted by Schlick's approximation, we factor it out of the integral,
  // yielding to the form: F0 * I1 + I2
  // I1 and I2 are slighlty different in the Fresnel term, but both only depend on
  // NoL and roughness, so they are both numerically integrated and written into two channels.
  float A = 0;
  float B = 0;
  float C = 0;

  for (uint i = 0; i < NUM_SAMPLES; ++i) {
    // Importance sampling, depending on the distribution.
    vec3 H = getImportanceSample(distributionType, i, N, roughness);
    vec3 L = normalize(reflect(-V, H));

    float NdotL = saturate(L.z);
    float NdotH = saturate(H.z);
    float dotVH = saturate(dot(V, H));
    float alphaRoughness = roughness * roughness;

    if (NdotL > 0.) {
      if (distributionType == DISTRIBUTION_GGX) {
        float dotVH = saturate(dot(viewDirection, halfDirection));
        float NdotH = saturate(dot(normal, halfDirection));
        float D = D_Charlie(sheenRoughness, NdotH);
        return max(D * NdotH / (4. * dotVH), 0.);

        A += 0;
        B += 0;
        C += sheenVisibility * sheenDistribution * NdotL * dotVH;
      }
    }
  }

  // The PDF is simply pdf(v, h) -> NDF * <nh>.
  // To parametrize the PDF over l, use the Jacobian transform, yielding to: pdf(v, l) -> NDF * <nh> / 4<vh>
  // Since the BRDF divide through the PDF to be normalized, the 4 can be pulled out of the integral.
  return vec3(4. * A, 4. * B, 4. * 2. * PI * C) / float(NUM_SAMPLES);
}

/*

// entry point
void filterCubeMap(uint distributionType, uint currentMipLevel, float roughness, float filterWidth)
{
	vec2 newUV = inUV * float(1 << currentMipLevel);

	newUV = newUV*2.-1.;

	for(int face = 0; face < 6; ++face)
	{
		vec3 scan = uvToXYZ(face, newUV);

		vec3 direction = normalize(scan);
		direction.y = -direction.y;

		writeFace(face, filterColor(distributionType, direction, roughness, filterWidth));

		//Debug output:
		//writeFace(face,  texture(uCubeMap, direction).rgb);
		//writeFace(face,   direction);
	}

	// Write LUT:
	// x-coordinate: NdotV
	// y-coordinate: roughness
	if (currentMipLevel == 0)
	{

		outLUT = LUT(distributionType, inUV.x, inUV.y, roughness);

	}
}

*/

