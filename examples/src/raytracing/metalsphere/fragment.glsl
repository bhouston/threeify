precision highp float;

in vec4 v_homogeneousVertexPosition;

uniform mat4 viewToWorld;
uniform mat4 worldToView;
uniform mat4 clipToView;

uniform mat4 planeToWorld;
uniform mat4 worldToPlane;
uniform vec2 planeDimensions;
uniform vec3 planeAlbedo;

uniform mat4 sphereToWorld;
uniform mat4 worldToSphere;
uniform float sphereRadius;
uniform vec3 sphereAlbedo;

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

  Plane plane = Plane( vec3( 0.0, 0.0, -1.0 ), 0.0 );
  Sphere sphere = Sphere( vec3( 0.0 ), sphereRadius);

  Hit hit;



  // does it hit the sphere?
  Ray sphereRay = mat4TransformRay( worldToSphere * viewToWorld, viewRay );
  if( raySphereIntersection( sphereRay, sphere, hit) ) {
    hit = mat4TransformHit( worldToView * sphereToWorld, hit );
    if( hit.distance > hitDistance ) {
      hitAledo = sphereAlbedo;
      hitDistance = hit.distance;
      hitNormal = hit.normal;
    }
  }


  // does it hit the sphere?
  Ray planeRay = mat4TransformRay(worldToPlane * viewToWorld, viewRay );
  if( rayPlaneIntersection( planeRay, plane, hit) ) {
    hit = mat4TransformHit( worldToView * planeToWorld, hit );
    if( hit.distance > hitDistance ) {
      hitAledo = planeAlbedo;
      hitDistance = hit.distance;
      hitNormal = hit.normal;
    }
  }



  if( debugOutput == 0 ) {
      outputColor.rgb = hitAledo;
  } else if( debugOutput == 1 ) {
    outputColor.rgb = normalToColor( hitNormal );
  }
  else if( debugOutput == 2 ) {
    outputColor.rgb = vec3( -hitDistance * 0.2 );
  }
  outputColor.a = 1.0;
  return;
}
