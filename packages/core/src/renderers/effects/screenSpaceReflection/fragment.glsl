#version 300 es
precision highp float;

// Input uniforms and textures
uniform sampler2D uColor;
uniform sampler2D uNormal;
uniform sampler2D uRoughness;
uniform sampler2D uDepth;
uniform mat4 uViewToClip;
uniform mat4 uClipToView;

// Input varying
in vec2 vTexCoord;

// Output
out vec4 fragColor;

// Ray marching settings
const int MAX_STEPS = 64;
const float MAX_REFLECTION_DISTANCE = 100.0;
const float RAY_STEP_SIZE = 0.05;

vec3 getViewSpacePosition(vec2 screenSpaceTexCoord, float depth) {
    vec4 clipSpacePosition = vec4(2.0 * screenSpaceTexCoord - 1.0, 2.0 * depth - 1.0, 1.0);
    vec4 viewSpacePosition = uClipToView * clipSpacePosition;
    return viewSpacePosition.xyz / viewSpacePosition.w;
}

vec2 getViewSpaceRay(vec3 viewSpacePosition, vec3 viewSpaceNormal, vec3 viewDirection) {
    vec3 reflection = reflect(viewDirection, viewSpaceNormal);
    return reflection.xy / -reflection.z;
}

vec2 getScreenSpaceReflection(vec3 viewSpacePosition, vec3 viewSpaceNormal, vec3 viewDirection) {
    vec2 screenSpaceRay = getViewSpaceRay(viewSpacePosition, viewSpaceNormal, viewDirection);

    vec2 screenSpaceTexCoord = vTexCoord;
    float rayLength = 0.0;

    for (int i = 0; i < MAX_STEPS; i++) {
        screenSpaceTexCoord += screenSpaceRay * RAY_STEP_SIZE;
        rayLength += RAY_STEP_SIZE;

        if (screenSpaceTexCoord.x < 0.0 || screenSpaceTexCoord.x > 1.0 || screenSpaceTexCoord.y < 0.0 || screenSpaceTexCoord.y > 1.0 || rayLength > MAX_REFLECTION_DISTANCE) {
            break;
        }

        float depth = texture(uDepth, screenSpaceTexCoord).r;
        vec3 hitViewSpacePosition = getViewSpacePosition(screenSpaceTexCoord, depth);

        if (rayLength >= length(hitViewSpacePosition - viewSpacePosition)) {
            return screenSpaceTexCoord;
        }
    }

    return vec2(-1.0);
}

void main() {
    float depth = texture(uDepth, vTexCoord).r;
    vec3 viewSpacePosition = getViewSpacePosition(vTexCoord, depth);
    vec3 viewSpaceNormal = texture(uNormal, vTexCoord).rgb * 2.0 - 1.0;
    vec3 viewDirection = normalize(viewSpacePosition);
    float roughness = texture(uRoughness, vTexCoord).r;

    vec2 reflectionTexCoord = getScreenSpaceReflection(viewSpacePosition, viewSpaceNormal, viewDirection);

    if (reflectionTexCoord.x >= 0.0) {
        vec3 reflectionColor = texture(uColor, reflectionTexCoord).rgb;
        vec3 baseColor = texture(uColor, vTexCoord).rgb;

        // Apply roughness
        float reflectionStrength = pow(1.0 - roughness, 2.0);
        fragColor = vec4(mix(baseColor, reflectionColor, reflectionStrength), 1.0);
    } else {
        fragColor = texture(uColor, vTexCoord);
    }
}
