Threeify has decided to use occlusions are:
- Diffuse BRDF.  This is just a linear damping of diffuse response based on amount of occlusion.
- Specular BRDF based on the specular occlusion formulation.  I am following the derivation of "specular occlusion" as covered in section "4.10.2" of the Frostbite PBR source notes from 2014 SIGGRAPH Physically Based Shading course notes.
- Clearcoat Specular BRDF based on the same specular occlusion formulation given above.
- Sheen, we are using the specular occlusion formulation as well, although it is likely not fully accurate as it is fitted for the GGX distrubtion, which is not used by the Sheen BRDF.
