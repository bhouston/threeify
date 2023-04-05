precision highp float;

in vec3 v_viewSurfaceNormal;

uniform mat4 viewToWorld;
uniform mat4 worldToView;
uniform mat4 clipToView;

#define MAX_SPHERES (40)

uniform vec3 sphereOrigin;
uniform mat4 sphereToWorld;
uniform mat4 worldToSphere;
uniform float sphereRadius;
uniform vec3 sphereAttenuationColor;
uniform vec3 sphereAttenuationDistance;
uniform float sphereIor;

uniform int debugOutput;
uniform int numBounces;

uniform samplerCube iblWorldMap;

out vec4 outputColor;

#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"
#pragma import "@threeify/core/dist/shaders/cubemaps/latLong.glsl"
#pragma import "@threeify/core/dist/shaders/raytracing/sphere.glsl"
#pragma import "@threeify/core/dist/shaders/raytracing/plane.glsl"
#pragma import "@threeify/core/dist/shaders/microgeometry/normalPacking.glsl"
#pragma import "@threeify/core/dist/shaders/color/tonemapping/acesfilmic.glsl"
#pragma import "@threeify/core/dist/shaders/color/spaces/srgb.glsl"



// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md
vec3 attentuationCoefficient(
  vec3 attenutationColor,
  float attenuationDistance
) {
  return -log(attenutationColor) / attenuationDistance;
}

// validated.
vec3 attentuationOverDistance(vec3 attentuationCoefficient, float distance) {
  return exp(-attentuationCoefficient * distance);
}

float fresnelReflection(vec3 incidentRay, vec3 surfaceNormal, float eta) {
  float cosTheta = dot(incidentRay, surfaceNormal);
  float sinTheta = sqrt(1.0 - cosTheta * cosTheta);
  float sinThetaPrime = eta * sinTheta;
  float cosThetaPrime = sqrt(1.0 - sinThetaPrime * sinThetaPrime);
  float rParallel =
    (cosTheta - eta * cosThetaPrime) /
    (cosTheta + eta * cosThetaPrime + 0.000001);
  float rPerpendicular =
    (eta * cosTheta - cosThetaPrime) /
    (eta * cosTheta + cosThetaPrime + 0.000001);
  
  return clamp( (rParallel * rParallel + rPerpendicular * rPerpendicular) / 2.0, 0.0, 1.0 );
}


#define DEBUG_EXTERNAL_REFLECTION
#define DEBUG_EXTERNAL_REFRACTION
#define DEBUG_OUTPUT_FIRST_BOUNCE
#define DEBUG_INTERNAL_ATTENUATION
//#define DEBUG_USE_CUBEMAP_NORMALS
//#define DEBUG_OUTPUT_COLORS
#define DEBUG_BOOST
#define DEBUG_FACET_HIT_CORRECTION
//#define DEBUG_OUTPUT_HIT_NORMALS


#define MAX_BOUNCES (12)

void main() {


  vec3 accumulatedColor = vec3(0.0);
  vec3 transmission = vec3(1.0);

  // convert from screen space to ray.
  vec3 viewDirection = normalize(v_viewSurfaceNormal);
  
  // create ray
  Ray viewRay = Ray(vec3(0.0), viewDirection);
  Ray worldRay = mat4TransformRay(viewToWorld, viewRay);
  
  Sphere worldSphere = Sphere(sphereOrigin, sphereRadius);
  Hit externalHit;
  if( raySphereIntersection(worldRay, worldSphere, externalHit) ) {
    
    vec3 reflectedRayDirection = reflect(
      worldRay.direction,
      externalHit.normal
    );
    Ray reflectedRay = Ray(externalHit.position, reflectedRayDirection);

    vec3 refractedRayDirection = refract(
      worldRay.direction,
      externalHit.normal,
      1.0 / sphereIor
    );
    Ray internalRay = Ray(externalHit.position, refractedRayDirection);

    // calculate fresnel reflection and transmission
    float reflectionCoefficient = 
      fresnelReflection( // This works!  Black at ior 1 at edges.
        -worldRay.direction,
        externalHit.normal,
        1.0 / sphereIor
      );

    vec3 iblColor = texture( iblWorldMap, reflectedRayDirection, 0.0 ).rgb;

#ifdef DEBUG_EXTERNAL_REFLECTION
    accumulatedColor += reflectionCoefficient * iblColor;
#endif // DEBUG_EXTERNAL_REFLECTION


  float transmissionCoefficient = 1.0 - reflectionCoefficient;
  transmission *= transmissionCoefficient;

#ifdef DEBUG_EXTERNAL_REFRACTION
  iblColor =texture( iblWorldMap, refractedRayDirection, 0.0 ).rgb;
  accumulatedColor += transmission * iblColor;
#endif // DEBUG_EXTERNAL_REFRACTION

#ifdef DEBUG_OUTPUT_FIRST_BOUNCE
  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(accumulatedColor));
  outputColor.a = 1.0;
  return;
}
#endif // DEBUG_OUTPUT_FIRST_BOUNCE

/*
  for (int b = 0; b < numBounces; b++) {
    vec3 hitAlbedo = vec3(1.0);

    Hit bestHit = Hit(1000.0, vec3(0.0), vec3(0.0));

    for (int i = 0; i < MAX_SPHERES; i++) {
      Hit hit;
      if (raySphereIntersection(worldRay, worldSphere, hit)) {
        if (hit.distance > 0.0 && hit.distance < bestHit.distance && (dot( hit.normal, worldRay.direction ) <= 0. ) ) {
          hitAlbedo = sphereAlbedos[i];
          bestHit = hit;
        }
      }
    }

    if (debugOutput == 1) {
      outputColor.rgb = hitAlbedo;
      outputColor.a = 1.0;
      return;
    } else if (debugOutput == 2) {
      outputColor.rgb = normalToColor(bestHit.normal);
      outputColor.a = 1.0;
      return;
    } else if (debugOutput == 3) {
      outputColor.rgb = vec3(-bestHit.distance * 0.4);
      outputColor.a = 1.0;
      return;
    }

    if (bestHit.distance < 1000.0) {
      reflection *= hitAlbedo;
      worldRay.origin = bestHit.position + bestHit.normal * 0.001;
      worldRay.direction = reflect(worldRay.direction, bestHit.normal);
    } else {
      break;
    }
  }

  vec3 iblColor = texture(iblWorldMap, worldRay.direction, 0.0).rgb;
  vec3 reflectedColor = reflection * iblColor;
  outputColor.rgb = linearTosRGB(tonemappingACESFilmic(reflectedColor));
  outputColor.a = 1.0;
  return;

}*/