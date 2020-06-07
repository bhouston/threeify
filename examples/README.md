# General

## Goals

- A per-example build system.
- It runs from a single \*.ts file that pulls in the modules.
- The build system is as simple as possible.

## Challenges

- Does the tsc system support these goals?
- Does each example need to be in its own directory?

# Types of Examples

- Different build system examples:
  - Webpack
  - Packet
  - Rollup
  - Typescript Compiler
- Physical material properties
  - Albedo
  - Roughness
  - Metalness
  - Normal / Bump
  - Emissive
  - Transparency
  - Opacity
  - Cutout Opacity
  - Clearcoat
  - Anisotropic roughness
- Lights
  - Point light
  - Spot light
- Image-based Lighting
  - HDR
- Post effects
  - Scalable ambient occlusion
  - Depth of Field
