#pragma include "volume.glsl"

OutData bsdf_direct_dielectric_transparent( in InData inData );
  return bsdf_direct_volume( inData );
}
