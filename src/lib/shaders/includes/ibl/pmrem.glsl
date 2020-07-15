
#define NUM_SAMPLES (1024) // Q: What did the glTF IBL Sample use for this number?

#pragma include <math/hammersley.glsl>

vec3 getImportanceSampleDirection(vec3 normal, float sinTheta, float cosTheta, float phi) {
	vec3 H = normalize(vec3(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta));

  vec3 bitangent = vec3(0.0, 1.0, 0.0);

	// Eliminates singularities.
	float NdotX = dot(normal, vec3(1.0, 0.0, 0.0));
	float NdotY = dot(normal, vec3(0.0, 1.0, 0.0));
	float NdotZ = dot(normal, vec3(0.0, 0.0, 1.0));
	if (abs(NdotY) > abs(NdotX) && abs(NdotY) > abs(NdotZ))
	{
		// Sampling +Y or -Y, so we need a more robust bitangent.
		if (NdotY > 0.0)
		{
			bitangent = vec3(0.0, 0.0, 1.0);
		}
		else
		{
			bitangent = vec3(0.0, 0.0, -1.0);
		}
	}

    vec3 tangent = cross(bitangent, normal);
    bitangent = cross(normal, tangent);

	return normalize(tangent * H.x + bitangent * H.y + normal * H.z);
}

#pragma include <brdfs/specular/d_ggx> // NOTE: takes alpha, original versions here took roughness
#pragma include <brdfs/sheen/d_charlie>

vec3 getImportanceSample(uint sampleIndex, vec3 N, float roughness)
{
	float u = float(sampleIndex) / float(NUM_SAMPLES);
	float v = Hammersley(sampleIndex);

	float phi = 2.0 * PI * u;
    float cosTheta = 0.f;
	float sinTheta = 0.f;

	if(pFilterParameters.distribution == cLambertian)
	{
		cosTheta = 1.0 - v;
		sinTheta = sqrt(1.0 - cosTheta*cosTheta);
	}
	else if(pFilterParameters.distribution == cGGX)
	{
		float alphaRoughness = roughness * roughness;
		cosTheta = sqrt((1.0 - v) / (1.0 + (alphaRoughness*alphaRoughness - 1.0) * v));
		sinTheta = sqrt(1.0 - cosTheta*cosTheta);
	}
	else if(pFilterParameters.distribution == cCharlie)
	{
		float alphaRoughness = roughness * roughness;
		sinTheta = pow(v, alphaRoughness / (2.0*alphaRoughness + 1.0));
		cosTheta = sqrt(1.0 - sinTheta * sinTheta);
	}

	return getImportanceSampleDirection(N, sinTheta, cosTheta, phi);
}

float PDF(vec3 V, vec3 H, vec3 N, vec3 L, float roughness)
{
	if(pFilterParameters.distribution == cLambertian)
	{
		float dotNL = dot(N, L);
		return max(dotNL * RECIPROCAL_PI, 0.0);
	}
	else if(pFilterParameters.distribution == cGGX)
	{
		float dotVH = saturate( dot(V, H) );
		float dotNH = saturate( dot(N, H) );
    float alpha = roughness * roughness;

		float D = D_GGX( alpha, dotNH);
		return max(D * dotVH / (4.0 * dotVH), 0.0);
	}
	else if(pFilterParameters.distribution == cCharlie)
	{
		float dotVH = saturate( dot(V, H) );
		float dotNH = saturate( dot(N, H) );

		float D = D_Charlie(roughness, dotNH);
		return max(D * dotVH / (4.0 * dotVH), 0.0);
	}

	return 0.f;
}

vec3 filterColor(vec3 N, float roughness)
{
	vec4 color = vec4(0.f);
	const uint NumSamples = NUM_SAMPLES;
	const float solidAngleTexel = 4.0 * PI / (6.0 * pFilterParameters.width * pFilterParameters.width);

	for(uint i = 0; i < NumSamples; ++i)
	{
		vec3 H = getImportanceSample(i, N, roughness);
		// Note: reflect takes incident vector.
		// Note: N = V
		vec3 V = N;
		vec3 L = normalize(reflect(-V, H));

		float NdotL = dot(N, L);

		if (NdotL > 0.0)
		{
			float lod = 0.0;

			if (roughness > 0.0 || pFilterParameters.distribution == cLambertian)
			{
				// Mipmap Filtered Samples
				// see https://github.com/derkreature/IBLBaker
				// see https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch20.html
				float pdf = PDF(V, H, N, L, roughness );

				float solidAngleSample = 1.0 / (NumSamples * pdf);

				lod = 0.5 * log2(solidAngleSample / solidAngleTexel);
				lod += pFilterParameters.lodBias;
			}

			if(pFilterParameters.distribution == cLambertian)
			{
				color += vec4(texture(uCubeMap, H, lod).rgb, 1.0);
			}
			else
			{
				color += vec4(textureLod(uCubeMap, L, lod).rgb * NdotL, NdotL);
			}
		}
	}

	if(color.w == 0.f)
	{
		return color.rgb;
	}

	return color.rgb / color.w;
}

#pragma include <brdfs/specular/v_ggx_smithcorrelated>  // NOTE: takes alpha, original versions here took roughness
#pragma include <brdfs/sheen/v_charlie>

// Compute LUT for GGX distribution.
// See https://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
vec3 LUT(float NdotV, float roughness)
{
	// Compute spherical view vector: (sin(phi), 0, cos(phi))
	vec3 V = vec3(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV);

	// The macro surface normal just points up.
	vec3 N = vec3(0.0, 0.0, 1.0);

	// To make the LUT independant from the material's F0, which is part of the Fresnel term
	// when substituted by Schlick's approximation, we factor it out of the integral,
	// yielding to the form: F0 * I1 + I2
	// I1 and I2 are slighlty different in the Fresnel term, but both only depend on
	// NoL and roughness, so they are both numerically integrated and written into two channels.
	float A = 0;
	float B = 0;
	float C = 0;

	for(uint i = 0; i < NUM_SAMPLES; ++i)
	{
		// Importance sampling, depending on the distribution.
		vec3 H = getImportanceSample(i, N, roughness);
		vec3 L = normalize(reflect(-V, H));

		float dotNL = saturate(L.z);
		float dotNH = saturate(H.z);
		float dotVH = saturate(dot(V, H));
    float alphaRoughness = roughness * roughness;

		if (NdotL > 0.0)
		{

			if (pFilterParameters.distribution == cGGX)
			{
				// LUT for GGX distribution.

				// Taken from: https://bruop.github.io/ibl
				// Shadertoy: https://www.shadertoy.com/view/3lXXDB
				// Terms besides V are from the GGX PDF we're dividing by.
				float V_pdf = V_SmithGGXCorrelated(alphaRoughness, dotNV, dotNL) * dotVH * dotNL / dotNH;
				float Fc = pow(1.0 - dotVH, 5.0);
				A += (1.0 - Fc) * V_pdf;
				B += Fc * V_pdf;
				C += 0;
			}

			if (pFilterParameters.distribution == cCharlie)
			{
				// LUT for Charlie distribution.
				float sheenDistribution = D_Charlie(roughness, dotNH);
				float sheenVisibility = V_Charlie(roughness, dotNL, dotNV);

				A += 0;
				B += 0;
				C += sheenVisibility * sheenDistribution * dotNL * dotVH;
			}
		}
	}

	// The PDF is simply pdf(v, h) -> NDF * <nh>.
	// To parametrize the PDF over l, use the Jacobian transform, yielding to: pdf(v, l) -> NDF * <nh> / 4<vh>
	// Since the BRDF divide through the PDF to be normalized, the 4 can be pulled out of the integral.
	return vec3(4.0 * A, 4.0 * B, 4.0 * 2.0 * PI * C) / NUM_SAMPLES;
}

// entry point
void filterCubeMap(uint currentMipLevel, float roughness)
{
	vec2 newUV = inUV * float(1 << currentMipLevel);

	newUV = newUV*2.0-1.0;

	for(int face = 0; face < 6; ++face)
	{
		vec3 scan = uvToXYZ(face, newUV);

		vec3 direction = normalize(scan);
		direction.y = -direction.y;

		writeFace(face, filterColor(direction, roughness));

		//Debug output:
		//writeFace(face,  texture(uCubeMap, direction).rgb);
		//writeFace(face,   direction);
	}

	// Write LUT:
	// x-coordinate: NdotV
	// y-coordinate: roughness
	if (currentMipLevel == 0)
	{

		outLUT = LUT(inUV.x, inUV.y, roughness);

	}
}
