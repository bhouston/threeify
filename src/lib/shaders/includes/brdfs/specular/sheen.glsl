//
// based on glTF Sample Viewer
//

//Sheen implementation-------------------------------------------------------------------------------------
// See  https://github.com/sebavan/glTF/tree/KHR_materials_sheen/extensions/2.0/Khronos/KHR_materials_sheen

// Estevez and Kulla http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
float D_Charlie(float sheenRoughness, float dotNH) {
  sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]
  float alphaG = sheenRoughness * sheenRoughness;
  float invR = 1.0 / alphaG;
  float cos2h = dotNH * dotNH;
  float sin2h = 1.0 - cos2h;
  return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * M_PI);
}

float D_Ashikhmin(float dotNH, float alphaRoughness) {
  // Ashikhmin 2007, "Distribution-based BRDFs"
  float a2 = alphaRoughness * alphaRoughness;
  float cos2h = dotNH * dotNH;
  float sin2h = 1.0 - cos2h;
  float sin4h = sin2h * sin2h;
  float cot2 = -cos2h / (a2 * sin2h);
  return 1.0 / (M_PI * (4.0 * a2 + 1.0) * sin4h) * (4.0 * exp(cot2) + sin4h);
}

// https://github.com/google/filament/blob/master/shaders/src/brdf.fs#L136
// https://github.com/google/filament/blob/master/libs/ibl/src/CubemapIBL.cpp#L179
// Note: Google call it V_Ashikhmin and V_Neubelt
float V_Ashikhmin(float dotNL, float dotNV) {
    return saturate(1.0 / (4.0 * (dotNL + dotNV - dotNL * dotNV)));
}

// f_sheen
vec3 BRDF_Specular_Sheen( const in Surface surface, vec3 lightDirection, vec3 sheenColor, float sheenIntensity, float sheenRoughness ) {
	vec3 halfDirection = normalize( lightDirection + surface.viewDirection );

	float dotNL = saturate( dot( surface.normal, lightDirection ) );
	float dotNV = saturate( dot( surface.normal, surface.viewDirection ) );
	float dotNH = saturate( dot( surface.normal, halfDirection ) );

  float sheenDistribution = D_Charlie(sheenRoughness, dotNH);
  float sheenVisibility = V_Ashikhmin(dotNL, dotNV);

  return sheenColor * sheenIntensity * sheenDistribution * sheenVisibility;

}
