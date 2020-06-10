# General

## Goals

- Include glsl files should mostly be standalone functions only that do not imply larger structure.
- Shaders should be straight forward and avoid indirection or complex defines.
- Include glsl files should be atomic as much as possible. This will reduce shader size.
- Ability to specific the output of a shader via a uniform (e.g. depth, normal, albedo, beauty.) How to reconcile with multi-target rendering. Single output per pass to start with, then later adopt the multi-target rendering approach.
- Adopt a layered approach where one calculates the outside layer.
- Rederive the environment BRDFs, including the multi-scatter. No one truly understands them. Create a Mathematic workbook or an Octive workbook that derives using the final equation.\_

## Challenges

- How to support a node-based shader graph system? Can I skip that in the near term? Yes.
- Support #include <> but with include guards. What to do when one wants to include a piece of code multiple times?
- Support loop unrolling with as simple syntax as possible.

## Changes from Three.js

- A complete rewrite.
