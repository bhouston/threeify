# General

## Goals

- Include glsl files should mostly be standalone functions only that do not imply larger structure.
- Shaders should be straight forward and avoid indirection or complex defines.
- Include glsl files should be atomic as much as possible. This will reduce shader size.
- Ability to specific the output of a shader via a uniform (e.g. depth, normal, albedo, beauty.) How to reconcile with multi-target rendering. Single output per pass to start with, then later adopt the multi-target rendering approach.
- Adopt a layered approach where one calculates the outside layer.
- Rederive the environment BRDFs, including the multi-scatter. No one truly understands them. Create a Mathematic workbook or an Octive workbook that derives using the final equation.\_
- Use the GLTF-Sample-Viewer as reference.
- Start with cubemap-based IBL and later upgrade to PMREM.
- Have a single unified light structure for punctual lights - based on GLTF-Sample-Viewer.

## Challenges

- How to support a node-based shader graph system? Can I skip that in the near term? Yes.
- Support #pragma import "" but with include guards. What to do when one wants to include a piece of code multiple times?
- Support loop unrolling with as simple syntax as possible.

## Changes from Three.js

- A complete rewrite.

## Naming Conventions

- Attributes are named a\_[camelCase]
- For each attribute that exists, create a A\_[ALLCAPS] define?
- Uniforms are named u\_[camelCase]
- Varyings are named v\_[camelCase]
- For each varying that exists create a V*[ALLCAPS] define? Or combine with A*[ALLCAPS] define into a HAS\_[ALLCAPS] define?

## Learnings from the glTF Sample Viewer

- They pass in uniforms for which uv set to use as well.
- They have a UVTransform matrix.
- They have a function to get the normal, bitangent, tangent matrix.
- What is the difference between MetallicRoughnessSpecular sampler and the MetallicRoughnessSampler?
- I guess SpecularGlossiness and Diffuse are for BlinnPhong model.
- No support for bump maps.
- Subsurface support, neat.
