
vec3 getPunctualRadianceSubsurface(vec3 n, vec3 v, vec3 l, float scale, float distortion, float power, vec3 color, float thickness)
{
    vec3 distortedHalfway = l + n * distortion;
    float backIntensity = max(0.0, dot(v, -distortedHalfway));
    float reverseDiffuse = pow(clamp(0.0, 1.0, backIntensity), power) * scale;
    return (reverseDiffuse + color) * (1.0 - thickness);
}

vec3 getPunctualRadianceTransmission(vec3 n, vec3 v, vec3 l, float alphaRoughness, float ior, vec3 f0)
{
    vec3 r = refract(-v, n, 1.0 / ior);
    vec3 h = normalize(l - r);
    float NdotL = clampedDot(-n, l);
    float NdotV = clampedDot(n, -r);

    float Vis = V_GGX(clampedDot(-n, l), NdotV, alphaRoughness);
    float D = D_GGX(clampedDot(r, l), alphaRoughness);

    return NdotL * f0 * Vis * D;
}

vec3 getPunctualRadianceClearCoat(vec3 clearcoatNormal, vec3 v, vec3 l, vec3 h, float VdotH, vec3 f0, vec3 f90, float clearcoatRoughness)
{
    float NdotL = clampedDot(clearcoatNormal, l);
    float NdotV = clampedDot(clearcoatNormal, v);
    float NdotH = clampedDot(clearcoatNormal, h);
    return NdotL * BRDF_specularGGX(f0, f90, clearcoatRoughness * clearcoatRoughness, VdotH, NdotL, NdotV, NdotH);
}

vec3 getPunctualRadianceSheen(vec3 sheenColor, float sheenIntensity, float sheenRoughness, float NdotL, float NdotV, float NdotH)
{
    return NdotL * BRDF_specularSheen(sheenColor, sheenIntensity, sheenRoughness, NdotL, NdotV, NdotH);
}
