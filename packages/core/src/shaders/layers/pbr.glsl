#pragma include "emission"
#pragma include "direct/pbr"
#pragma include "indirect/pbr"

// based on figure 2 from https://dassaultsystemes-technology.github.io/EnterprisePBRShadingModel/spec-2021x.md.html#components
OutData layer_pbr() {
  OutData outData;

  // point, directional, hemisphere, area, mesh(?)
  for (int directLight = 0; directLight < NUM_DIRECT_LIGHTS; directLight++) {
    outData += layer_direct_pbr(directLight);
  }

  // usually an ibl, a position offset (?) and a weight.
  for (
    int indirectLight = 0;
    indirectLight < NUM_INDIRET_LIGHTS;
    indirectLight++
  ) {
    outData += layer_indirect_pbr(indirectLight);
  }

  outData += layer_emission();

  return outData;
}
