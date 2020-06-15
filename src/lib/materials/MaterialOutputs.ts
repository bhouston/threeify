//
// Allows a shader to change its output with recompilation
//
// Authors:
// * @bhouston
//

export enum MaterialOutputs {
  Beauty = 0x1,
  Albedo = 0x2,
  Normal = 0x4,
  Depth = 0x8,
  Roughness = 0x10,
  Metalness = 0x20,
  Emissive = 0x40,
}
