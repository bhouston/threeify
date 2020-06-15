# General

## Goals

- Adopt promises as the main way to wait for asynchronous operations
- Examples of asset loading should make use of async and await.
- Never use XMLHttpRequest, instead use fetch.
- Do not use classes when it just loads a single asset, instead use a factory function.

## Most Desired Loaders

- Images:

  - Standard
    - Use HTMLImageElement to load png, jpg. - Easy.
  - High dynamic range:
    - HDR / RGBE? Easy to port, small code.
    - EXR - large loader, but more standard. Are the files smaller than HDR equivalents?
  - Compressed:
    - Binomial? How widely is this supported on mobile? How big is the loader? Can it support HDR?

- Meshes:

  - glTF. It contains meshes in a compact and efficient form.

- Scenes:

  - glTF. It contains a scene graph.

- Materials:
  - glTF. It can support physically-based materials. Ignore all other types of materials to start. Later, convert them to the closest PBR equivalents.
