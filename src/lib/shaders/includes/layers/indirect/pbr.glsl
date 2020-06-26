#pragma include "../emission"
#pragma include "specular"
#pragma include "sheen"
#pragma include "metal"
#pragma include "dielectric_opaque"
#pragma include "dielectric_transparent"

// based on figure 2 from https://dassaultsystemes-technology.github.io/EnterprisePBRShadingModel/spec-2021x.md.html#components

OutData layer_indirect_pbr(
  in Specular specular,
  in Sheen sheen,
  in Metal metal,
  in OpaqueDielectric opaqueDieletric,
  in TransparentDielectric transparentDielectric,
  in Volume volume,
   in Surface coatingSurface,
   in Surface mainSurface ) {

  // specular
  OutData specularOut = layer_direct_specular( specular, light, coatingSurface );

  light = specularOutput.transmission;

  // sheen
  OutData sheenOut = layer_direct_sheen( sheen, light, mainSurface );

  light = sheenOut.transmission;

  // dielectric
  OutData dielectricOpaqueOut = layer_direct_dielectric_opaque( opaqueDielectric, light, mainSurface );
  OutData dielectricTransparentOut = layer_direct_dielectric_transparent( transparentDielectric, light, mainSurface );
  OutData dielectricOut = mix( opaqueOut, transparentOut, transparency );

  // metal
  OutData metalOut = layer_direct_metal( metal, light, mainSurface );
  OutData metalDielectricOut = mix( dielectricOut, metalOut, metalness );

}
