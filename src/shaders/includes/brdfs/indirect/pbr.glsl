#pragma include "emissive"
#pragma include "specular"
#pragma include "sheen"
#pragma include "metal"
#pragma include "dielectric_opaque"
#pragma include "dielectric_transparent"

// based on figure 2 from https://dassaultsystemes-technology.github.io/EnterprisePBRShadingModel/spec-2021x.md.html#components

OutData bsdf_indirect_pbr(
  in Specular specular,
  in Sheen sheen,
  in Metal metal,
  in OpaqueDielectric opaqueDieletric,
  in TransparentDielectric transparentDielectric,
  in Volume volume,
   in Surface coatingSurface,
   in Surface mainSurface ) {

  // specular
  OutData specularOut = bsdf_direct_specular( specular, light, coatingSurface );

  light = specularOutput.transmission;

  // sheen
  OutData sheenOut = bsdf_direct_sheen( sheen, light, mainSurface );

  light = sheenOut.transmission;

  // dielectric
  OutData dielectricOpaqueOut = bsdf_direct_dielectric_opaque( opaqueDielectric, light, mainSurface );
  OutData dielectricTransparentOut = bsdf_direct_dielectric_transparent( transparentDielectric, light, mainSurface );
  OutData dielectricOut = mix( opaqueOut, transparentOut, transparency );

  // metal
  OutData metalOut = bsdf_direct_metal( metal, light, mainSurface );
  OutData metalDielectricOut = mix( dielectricOut, metalOut, metalness );

}
