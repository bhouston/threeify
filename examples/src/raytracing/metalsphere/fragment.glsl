precision highp float;

in vec4 v_homogeneousVertexPosition;

uniform mat4 viewToWorld;
uniform mat4 worldToView;
uniform mat4 clipToView;

#define MAX_SPHERES 10

uniform mat4 sphereToWorlds[MAX_SPHERES];
uniform mat4 worldToSpheres[MAX_SPHERES];
uniform float sphereRadii[MAX_SPHERES];
uniform vec3 sphereAlbedos[MAX_SPHERES];
    
uniform int debugOutput;

uniform samplerCube iblWorldMap;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/cubemaps/latLong.glsl"
#pragma import "@threeify/core/dist/shaders/raytracing/sphere.glsl"
#pragma import "@threeify/core/dist/shaders/raytracing/plane.glsl"
#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"

void main() {
  // convert from screen space to ray.
  vec3 viewPosition = (viewToWorld *
    clipToView *
    v_homogeneousVertexPosition).xyz;
  vec3 viewDirection = normalize(viewPosition);

  // create ray
  Ray viewRay = Ray(vec3(0.0), viewDirection);

  vec3 hitAledo = vec3(0.0);
  float hitDistance = -1000.0;
  vec3 hitNormal = vec3(0.0);

 
  Hit hit;

  for( int i = 0; i < MAX_SPHERES; i++ ) {
   Sphere sphere = Sphere(vec3(0.0), sphereRadii[i]);
   // does it hit the sphere?
    Ray sphereRay = mat4TransformRay(worldToSpheres[i] * viewToWorld, viewRay);
    if (raySphereIntersection(sphereRay, sphere, hit) ) {
      hit = mat4TransformHit(worldToView * sphereToWorlds[i], hit);
     // if (hit.distance > hitDistance) {
        hitAledo = sphereAlbedos[i];
        hitDistance = hit.distance;
        hitNormal = hit.normal;
      //}
    }
  }


  if (debugOutput == 0) {
    outputColor.rgb = hitAledo;
  } else if (debugOutput == 1) {
    outputColor.rgb = normalToColor(hitNormal);
  } else if (debugOutput == 2) {
    outputColor.rgb = vec3(-hitDistance * 0.2);
  }
  outputColor.a = 1.0;
  return;
}
