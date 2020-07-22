//
// Allows a shader to change its output with recompilation
//
// Authors:
// * @bhouston
//

export enum FragmentOutput {
  Beauty = 0x1,
  Albedo = 0x2,
  Normal = 0x4,
  Depth = 0x8,
  Roughness = 0x10,
  Metalness = 0x20,
  Emissive = 0x40,
  Diffuse = 0x80,
  Specular = 0x100,
  DepthPacked = 0x200,
}
