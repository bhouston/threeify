
// from glTF reference viewer: https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/src/shaders/functions.glsl
vec3 transmissionAbsorption(vec3 v, vec3 n, float ior, float thickness, vec3 absorptionColor)
{
    vec3 r = refract(-v, n, 1.0 / ior);
    return exp(-absorptionColor * thickness * dot(-n, r));
}
