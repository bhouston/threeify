# Goals:

* Support shader-network materials.
* Support by default only one material, the glTF PBR next material.  It should have simple value inputs, all texture reads are done in the shader-network.

# Challenges:

* How to have a shader easily output normal, depth, diffuse as separate outputs without specialized shaders?  Can we have a uniform on a shader that tells it what to output?  Could we use the multiple render target output extension?  Is it always supported in WebGL2?

