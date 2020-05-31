# General

## Goals

* Adopt promises as the main way to wait for asynchronous operations
* Examples of asset loading should make use of async and await.
* Never use XMLHttpRequest, instead use fetch.
* Do not use classes when it just loads a single asset, instead use a factory function.

## Most Desired Loaders

* Standard Image Loader (png, jpg) - Easy.
* High dynamic range texture format:
 * HDR / RGBE?
 * EXR - large loader.
* Compressed texture format:
 * Binomial?  How widely is this supported on mobile?  How big is the loader?  Can it support HDR?

* 3D Models:
 * glTF.  Maybe start with just scene graph, meshes and physical materials.  Skip animation, bones, skinning, points, lines and all non PBR materials.

