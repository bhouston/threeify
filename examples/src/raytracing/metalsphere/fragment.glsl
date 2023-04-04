precision highp float;

in vec3 v_viewSurfaceNormal;

uniform mat4 viewToWorld;
uniform mat4 worldToView;
uniform mat4 clipToView;

#define MAX_SPHERES (10)

uniform vec3 sphereOrigins[MAX_SPHERES];
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
#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"

vec3 localDirectionToIBLSample(
  vec3 localDirection,
  mat4 localToWorld,
  samplerCube iblWorldMap
) {
  vec3 worldDirection = mat4TransformNormal3(localToWorld, localDirection);
  return texture(iblWorldMap, worldDirection, 0.0).rgb;
}

#define MAX_BOUNCES (5)

void main() {
  // convert from screen space to ray.
  vec3 viewDirection = normalize(v_viewSurfaceNormal);
  
  // create ray
  Ray viewRay = Ray(vec3(0.0), viewDirection);
  Ray worldRay = mat4TransformRay(viewToWorld, viewRay);

  for (int b = 0; b < MAX_BOUNCES; b++) {
    vec3 hitAlbedo = vec3(0.0);
    float hitDistance = 1000.0;
    vec3 hitNormal = vec3(0.0);

    Hit hit;

    for (int i = 0; i < MAX_SPHERES; i++) {
      Sphere worldSphere = Sphere(sphereOrigins[i], sphereRadii[i]);
      if (raySphereIntersection(worldRay, worldSphere, hit)) {
        if (hit.distance > 0.0 && hit.distance < hitDistance && (dot( hit.normal, worldRay.direction ) < 0. ) ) {
          hitAlbedo = sphereAlbedos[i];
          hitDistance = hit.distance;
          hitNormal = hit.normal;
        }
      }
    }
    if (debugOutput == 1) {
      outputColor.rgb = hitAlbedo;
      outputColor.a = 1.0;
      return;
    } else if (debugOutput == 2) {
      outputColor.rgb = normalToColor(hitNormal);
      outputColor.a = 1.0;
      return;
    } else if (debugOutput == 3) {
      outputColor.rgb = vec3(-hitDistance * 0.4);
      outputColor.a = 1.0;
      return;
    }

    if (hitDistance < 1000.0) {
      worldRay.origin = hit.position + hit.normal * 0.001;
      worldRay.direction = reflect(worldRay.direction, hit.normal);
    } else {
      break;
    }
  }

  vec3 iblColor = texture(iblWorldMap, worldRay.direction, 0.0).rgb;

  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(iblColor));
  outputColor.a = 1.0;
  return;
}
