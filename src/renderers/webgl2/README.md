# General

## Goals

- Try to match the underlying abstractions used by WebGL2.
- Try to use the same names as those by WebGL2.
- Do not priviledge any specific materials in the core code.
- Automatic framebuffer pooling behind render targets. You can reserve and then release them.
- Allow for a single renderPass call that renders the whole framebuffer with a screen-based UV (a pre-created plane.)

## Challenges

- How to sync up easy to use scene graph structure to the WebGL2 low level implementation.
  - Can we learn from React, React-three-fiber, Redux, Immutability.

## Changes from Three.js

- A complete rewrite.
