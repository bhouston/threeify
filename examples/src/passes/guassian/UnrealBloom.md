It creates a chain of mipmap like textures.

* Original - 1024
* BlurH1 / BlurV1 - 512
* BlurH2 / BlurV2 - 256
* BlurH3 / BlurV3 - 128
* BlurH4 / BlurV4 - 64
* BlurH5 / BlurV5 - 32

BlurH1 uses previous texture as input.
BlurV1 uses BlurH1 output as input
BlurH2 uses BlurV2 output as input
BlurV2 uses BlurH2 output as input.

The blur radius starts small gets larger on each successive layer:
[ 3, 5, 7, 9, 11 ]

Here is the separatable blur filter:
```glsl
#include <common>
varying vec2 vUv;
uniform sampler2D colorTexture;
uniform vec2 texSize;
uniform vec2 direction;

float gaussianPdf(in float x, in float sigma) {
    return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
}
void main() {
    vec2 invSize = 1.0 / texSize;
    float fSigma = float(SIGMA);
    float weightSum = gaussianPdf(0.0, fSigma);
    vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
    for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
        float x = float(i);
        float w = gaussianPdf(x, fSigma);
        vec2 uvOffset = direction * invSize * x;
        vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
        vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
        diffuseSum += (sample1 + sample2) * w;
        weightSum += 2.0 * w;
    }
    gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
}`
```

Here is the optimized Three.js blur shader:

```glsl
uniform sampler2D tDiffuse;
uniform float h;

varying vec2 vUv;

void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    gl_FragColor = sum;

}`
```


Once the blurs textures are all calculated, then they are just summed up with these weights:


const bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];


```glsl
varying vec2 vUv;
uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D blurTexture3;
uniform sampler2D blurTexture4;
uniform sampler2D blurTexture5;
uniform float bloomStrength;
uniform float bloomRadius;
const float bloomFactors[NUM_MIPS] = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
uniform vec3 bloomTintColors[NUM_MIPS];

float lerpBloomFactor(const in float factor) {
    float mirrorFactor = 1.2 - factor;
    return mix(factor, mirrorFactor, bloomRadius);
}

void main() {
    gl_FragColor = bloomStrength *
      ( lerpBloomFactor(bloomFactors[0]) * texture2D(blurTexture1, vUv) +
        lerpBloomFactor(bloomFactors[1]) * texture2D(blurTexture2, vUv) +
        lerpBloomFactor(bloomFactors[2]) * texture2D(blurTexture3, vUv) +
        lerpBloomFactor(bloomFactors[3]) * texture2D(blurTexture4, vUv) +
        lerpBloomFactor(bloomFactors[4]) * texture2D(blurTexture5, vUv) );
}
```

Q: What is lerpBloomFactor for?

