
vec3 BRDF_specularAnisotropicGGX(vec3 f0, vec3 f90, float alphaRoughness, float VdotH, float NdotL, float NdotV, float NdotH,
    float BdotV, float TdotV, float TdotL, float BdotL, float TdotH, float BdotH, float anisotropy)
{
    // Roughness along tangent and bitangent.
    // Christopher Kulla and Alejandro Conty. 2017. Revisiting Physically Based Shading at Imageworks
    float at = max(alphaRoughness * (1. + anisotropy), 0.00001);
    float ab = max(alphaRoughness * (1. - anisotropy), 0.00001);

    vec3 F = F_Schlick(f0, f90, VdotH);
    float V = V_GGX_anisotropic(NdotL, NdotV, BdotV, TdotV, TdotL, BdotL, anisotropy, at, ab);
    float D = D_GGX_anisotropic(NdotH, TdotH, BdotH, anisotropy, at, ab);

    return F * V * D;
}
