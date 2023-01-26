# General

## Goals

- Try to match the underlying abstractions used by WebGL2.
- Try to use the same names as those by WebGL2.
- Do not privilege any specific materials in the core code.
- Automatic framebuffer pooling behind render targets. You can reserve and then release them. NO!
- Allow for a single renderPass call that renders the whole framebuffer with a screen-based UV (a pre-created plane.)
- Only one displayPixelRatio is specified and it is the difference between the canvas resolution and its associated renderbuffer resolution.

## Challenges

- How to sync up easy to use scene graph structure to the WebGL2 low level implementation.
  - Can we learn from React, React-three-fiber, Redux, Immutability.

## Changes from Three.js

- A complete rewrite.
