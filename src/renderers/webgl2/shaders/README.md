# General

## Goals

- Include glsl files should mostly be standalone functions only that do not imply larger structure.
- Shaders should be straight forward and avoid indirection or complex defines.
- Include glsl files should be atomic as much as possible. This will reduce shader size.

## Challenges

- How to support a node-based shader graph system? Can I skip that in the near term? Yes.
- Support #include <> but with include guards. What to do when one wants to include a piece of code multiple times?
- Support loop unrolling with as simple syntax as possible.

## Changes from Three.js

- A complete rewrite.
