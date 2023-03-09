This is based on this document:

https://catlikecoding.com/unity/tutorials/advanced-rendering/depth-of-field/



How DOF should work:

Inputs:

* color buffer
* depth buffer
* focal distance
* camera near/far
(This doesn't seem sufficeint to calculate CoC.)

Maybe Threeify should introduce a physical camera that has all this stuff so everything is completely correct and consistent?

Internal Buffers:

* color downsample (half size)
* coc downsample (half size)
* dof blur (half size)
* dot combine (full size)

(And some temp buffers for separable blur filters.)


==Downsample the Original texture==

* create color downsample, nothing special, just copy it.

==Create the coc material==

Inputs:

* depth texture
* near/far blur scale
* camera near/far
* focal distance

Outputs:

* coc downsample

```glsl

varying vec2 vUv;
uniform sampler2D depthTexture;
uniform vec2 NearFarBlurScale; // set to always be (0.1, 0.5)
uniform vec2 cameraNearFar;
uniform float focalDistance;
const float MAXIMUM_BLUR_SIZE = 8.0;

float computeCoc() {
    vec4 packDepth = texture2D(depthTexture, vUv).rgba;
    if(packDepth.x == 1.0) return max(NearFarBlurScale.x, NearFarBlurScale.y);
        float depth = unpackRGBAToDepth(packDepth);
        depth = -perspectiveDepthToViewZ(depth, cameraNearFar.x, cameraNearFar.y);
        float coc = (depth - focalDistance)/depth;
    return (coc > 0.0 ? coc * NearFarBlurScale.y : coc * NearFarBlurScale.x);
}

void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, computeCoc());
}

```

== Dilate Near Coc Material ==

This seems to use some clamping to get the smallest near by COC weighted by a guassian.  It is a separable filter for h and v.


```glsl
varying vec2 vUv;\n\
    uniform sampler2D cocTexture;\n\
    uniform sampler2D depthTexture;\n\
    uniform vec2 direction;\
    uniform vec2 texSize;\
    uniform vec2 NearFarBlurScale;\
    const float MAXIMUM_BLUR_SIZE = 8.0;\
    \
    float expandNear(const in vec2 offset, const in bool isBackground) {\
        float coc = 0.0;\
        vec2 sampleOffsets = MAXIMUM_BLUR_SIZE * offset / 5.0;\
        float coc0 = texture2D(cocTexture, vUv).a;\
        float coc1 = texture2D(cocTexture, vUv - 5.0 * sampleOffsets).a;\
        float coc2 = texture2D(cocTexture, vUv - 4.0 * sampleOffsets).a;\
        float coc3 = texture2D(cocTexture, vUv - 3.0 * sampleOffsets).a;\
        float coc4 = texture2D(cocTexture, vUv - 2.0 * sampleOffsets).a;\
        float coc5 = texture2D(cocTexture, vUv - 1.0 * sampleOffsets).a;\
        float coc6 = texture2D(cocTexture, vUv + 1.0 * sampleOffsets).a;\
        float coc7 = texture2D(cocTexture, vUv + 2.0 * sampleOffsets).a;\
        float coc8 = texture2D(cocTexture, vUv + 3.0 * sampleOffsets).a;\
        float coc9 = texture2D(cocTexture, vUv + 4.0 * sampleOffsets).a;\
        float coc10 = texture2D(cocTexture, vUv + 5.0 * sampleOffsets).a;\
            \
        if(isBackground){\
            coc = abs(coc0) * 0.095474 + \
            (abs(coc1) + abs(coc10)) * 0.084264 + \
            (abs(coc2) + abs(coc9)) * 0.088139 + \
            (abs(coc3) + abs(coc8)) * 0.091276 + \
            (abs(coc4) + abs(coc7)) * 0.093585 + \
            (abs(coc5) + abs(coc6)) * 0.094998;\
        } else {\
            coc = min(coc0, 0.0);\
            coc = min(coc1 * 0.3, coc);\
            coc = min(coc2 * 0.5, coc);\
            coc = min(coc3 * 0.75, coc);\
            coc = min(coc4 * 0.8, coc);\
            coc = min(coc5 * 0.95, coc);\
            coc = min(coc6 * 0.95, coc);\
            coc = min(coc7 * 0.8, coc);\
            coc = min(coc8 * 0.75, coc);\
            coc = min(coc9 * 0.5, coc);\
            coc = min(coc10 * 0.3, coc);\
            if(abs(coc0) > abs(coc))\
                coc = coc0;\
        }\
        return coc;\
    }\
    \
    void main() {\n\
        vec2 offset = direction/texSize;\
        float coc = expandNear(offset, texture2D(depthTexture, vUv).x == 1.0);\
        gl_FragColor = vec4(0.0, 0.0, 0.0, coc);\n\
}
```

=== DOF Blur Material ===

Use a separable guassian blur.

```
varying vec2 vUv;\n\
uniform sampler2D cocTexture;\n\
uniform sampler2D colorTexture;\n\
uniform vec2 texSize;\
uniform vec2 direction;\
const float MAXIMUM_BLUR_SIZE = 8.0;\
\
const float SIGMA = 5.0;\
const int NUM_SAMPLES = 4;\
float normpdf(in float x, in float sigma)\
{\
    return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;\
}\
\
vec4 weightedBlur() { \
    float cocIn = texture2D(cocTexture, vUv).a;\
    float kernelRadius = MAXIMUM_BLUR_SIZE * cocIn;\
    vec2 invSize = 1.0 / texSize;\
    cocIn *= cocIn * cocIn;\
    float centreSpaceWeight = normpdf(0.0, SIGMA) * abs(cocIn);\
    float weightSum = centreSpaceWeight;\
    vec4 centreSample = texture2D(colorTexture, vUv);\
    vec4 diffuseSum = centreSample * weightSum;\
    vec2 delta = invSize * kernelRadius/float(NUM_SAMPLES);\
    for( int i = 1; i <= NUM_SAMPLES; i ++ ) {\
            float spaceWeight = normpdf(float(i), SIGMA);\
            vec2 texcoord = direction * delta * float(i);\
            vec4 rightSample = texture2D( colorTexture, vUv + texcoord);\
            vec4 leftSample = texture2D( colorTexture, vUv - texcoord);\
            float leftCocWeight = abs(texture2D( cocTexture, vUv - texcoord).a);\
            float rightCocWeight = abs(texture2D( cocTexture, vUv + texcoord).a);\
            leftCocWeight *= leftCocWeight * leftCocWeight;\
            rightCocWeight *= rightCocWeight * rightCocWeight;\
            diffuseSum += ( (leftSample * leftCocWeight) + (rightSample * rightCocWeight) ) * spaceWeight;\
            weightSum += (spaceWeight * (leftCocWeight + rightCocWeight));\
    }\
    return diffuseSum/weightSum;\
}\
\
void main() {\n\
    gl_FragColor = weightedBlur();\n\
}
```

=== DOR Combine Material ===

Inputs:
* coc texture
* color
* depth
* blur color


```glsl
varying vec2 vUv;\n\
uniform sampler2D colorTexture;\n\
uniform sampler2D blurTexture;\n\
uniform sampler2D cocTexture;\n\
uniform sampler2D depthTexture;\n\
uniform vec2 texSize;\
uniform vec2 NearFarBlurScale;\
uniform vec2 cameraNearFar;\
uniform float focalDistance;\
\
float computeCoc() {\
    vec4 packedDepth = texture2D(depthTexture, vUv);\
    if(packedDepth.x == 1.0) return max(NearFarBlurScale.x, NearFarBlurScale.y);\
        float depth = unpackRGBAToDepth(packedDepth);\
        depth = -perspectiveDepthToViewZ(depth, cameraNearFar.x, cameraNearFar.y);\
        float coc = (depth - focalDistance)/depth;\
    return (coc > 0.0 ? coc * NearFarBlurScale.y : coc * NearFarBlurScale.x);\
}\
\
void main() {\n\
    vec4 blur = texture2D(blurTexture, vUv);\
    blur += texture2D(blurTexture, vUv + vec2(1.5, 0.5) / texSize);\
    blur += texture2D(blurTexture, vUv + vec2(-0.5, 1.5) / texSize);\
    blur += texture2D(blurTexture, vUv + vec2(-1.5, -0.5) / texSize);\
    blur += texture2D(blurTexture, vUv + vec2(0.5, -1.5) / texSize);\
    blur /= 5.0;\
    float coc = abs(min(texture2D(cocTexture, vUv).a, computeCoc()));\
    coc = clamp(coc * coc * 8.0, 0.0, 1.0);\
    vec4 color = mix(texture2D(colorTexture, vUv), blur, vec4(coc));\
    gl_FragColor = color;\n\
}"
```
