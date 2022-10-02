//
// Allows a shader to change its output with recompilation
//
// Authors:
// * @bhouston
//

export enum OutputChannels {
  Beauty = 0,

  Albedo = 1,
  Roughness = 2,
  Metalness = 3,
  Occlusion = 4,
  Emissive = 5,

  Normal = 6,
  Depth = 7,

  Ambient = 8,
  Diffuse = 9,
  Specular = 10,

  DepthPacked = 11,
  MetalnessRoughnessOcclusion = 12
}
