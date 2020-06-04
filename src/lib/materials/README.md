# Goals:

* Support shader-network materials.
* Support by default only one material, the glTF PBR next material.  It should have simple value inputs, all texture reads are done in the shader-network.

# Challenges:

* How to have a shader easily output normal, depth, diffuse as separate outputs without specialized shaders?  Can we have a uniform on a shader that tells it what to output?  Could we use the multiple render target output extension?  Is it always supported in WebGL2?

# Changes from Three.js

* PhysicalMaterial -> PBRMaterial and heavily refactored.
* Added TextureAccessor.
* All Material.[*]Map will be accessing a TextureAccessor rather than a Texture.
* Material.base -> Material.albedo.  This is more accurate.
