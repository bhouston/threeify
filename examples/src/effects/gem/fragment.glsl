#version 300 es
precision highp float;

// Input uniforms and textures
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform samplerCube uIBL;
uniform mat4 uViewToClip;
uniform mat4 uClipToView;

// Ray marching settings
const int MAX_STEPS = 64;
const float MAX_DISTANCE = 100.0;
const float RAY_STEP_SIZE = 0.05;

vec2 getViewSpaceRayToScreenSpace(vec3 viewSpacePosition, vec3 viewDirection) {
    vec4 clipSpacePosition = uViewToClip * vec4(viewSpacePosition, 1.0);
    vec3 normalizedDeviceCoords = clipSpacePosition.xyz / clipSpacePosition.w;
    return (normalizedDeviceCoords.xy * 0.5 + 0.5);
}

vec4 traceRayInViewSpace(vec3 viewSpacePosition, vec3 viewDirection) {
    vec2 screenSpaceRay = getViewSpaceRayToScreenSpace(viewSpacePosition, viewDirection);
    vec2 screenSpaceTexCoord = getViewSpaceRayToScreenSpace(viewSpacePosition, viewDirection);

    float rayLength = 0.0;

    for (int i = 0; i < MAX_STEPS; i++) {
        screenSpaceTexCoord += screenSpaceRay * RAY_STEP_SIZE;
        rayLength += RAY_STEP_SIZE;

        if (screenSpaceTexCoord.x < 0.0 || screenSpaceTexCoord.x > 1.0 || screenSpaceTexCoord.y < 0.0 || screenSpaceTexCoord.y > 1.0 || rayLength > MAX_DISTANCE) {
            break;
        }

        float depth = texture(uDepth, screenSpaceTexCoord).r;
        vec4 color = texture(uColor, screenSpaceTexCoord);
        float distanceToRay = abs(viewSpacePosition.z - depth);

        if (distanceToRay <= RAY_STEP_SIZE && color.a > 0.0) {
            return color;
        }
    }

    // Sample the cube map if the ray doesn't hit anything
    return texture(uIBL, viewDirection);
}