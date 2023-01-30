import {
  fetchImage,
  fetchOBJ,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  OutputChannels,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  transformGeometry
} from '@threeify/core';
import {
  Color3,
  color3MultiplyByScalar,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  Mat4,
  mat4Multiply,
  mat4PerspectiveFov,
  scale3ToMat4,
  translation3ToMat4,
  Vec2,
  vec2MultiplyByScalar,
  Vec3
} from '@threeify/vector-math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const [geometry] = await fetchOBJ('/assets/models/ninjaHead/ninjaHead.obj');
  transformGeometry(
    geometry,
    mat4Multiply(
      scale3ToMat4(new Vec3(0.06, 0.06, 0.06)),
      translation3ToMat4(new Vec3(0, -172, -4))
    )
  );
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const displacementTexture = new Texture(
    await fetchImage('/assets/models/ninjaHead/displacement.jpg')
  );
  const normalTexture = new Texture(
    await fetchImage('/assets/models/ninjaHead/normal.png')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const displacementMap = makeTexImage2DFromTexture(
    context,
    displacementTexture
  );
  const normalMap = makeTexImage2DFromTexture(context, normalTexture);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToScreen: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    pointLightViewPosition: new Vec3(0, 0, 0),
    pointLightIntensity: color3MultiplyByScalar(new Color3(1, 1, 1), 40),
    pointLightRange: 12,

    // materials
    normalMap,
    normalScale: new Vec2(1, 1),
    displacementMap,
    displacementScale: 1,

    // shader output
    time: 0
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  const fragmentOutputs = [
    OutputChannels.Depth,
    OutputChannels.DepthPacked,
    OutputChannels.Beauty,
    OutputChannels.Normal,
    OutputChannels.Albedo,
    OutputChannels.Diffuse,
    OutputChannels.Specular
  ];

  let lastNow = Date.now();
  let averageDelta = -1;

  function animate(): void {
    const now = Date.now();
    averageDelta =
      averageDelta < 0
        ? lastNow - now
        : averageDelta * 0.9 + (lastNow - now) * 0.1;
    lastNow = now;

    uniforms.time += averageDelta;
    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );

    const effectScale = Math.cos(now * 0.0008) * 0.5 + 0.5;
    uniforms.normalScale = vec2MultiplyByScalar(new Vec2(-1, 1), effectScale);
    uniforms.displacementScale = effectScale * 0.1;
    uniforms.pointLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 3,
      2,
      0.5
    );

    canvasFramebuffer.clear();
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
