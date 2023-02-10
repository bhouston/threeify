import {
  boxGeometry,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  textureToTexImage2D,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture
} from '@threeify/core';
import {
  Color3,
  color3MultiplyByScalar,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);
  const albedoTexture = new Texture(
    await fetchImage('/assets/textures/bricks/albedo.jpg')
  );
  const bumpTexture = new Texture(
    await fetchImage('/assets/textures/bricks/bump.jpg')
  );
  const specularRoughnessTexture = new Texture(
    await fetchImage('/assets/textures/bricks/roughness.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -2)),
    viewToScreen: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    pointLightViewPosition: new Vec3(2, 0, 3),
    pointLightIntensity: color3MultiplyByScalar(Color3.White, 10),
    pointLightRange: 12,

    // materials
    albedoMap: textureToTexImage2D(context, albedoTexture),
    bumpMap: textureToTexImage2D(context, bumpTexture),
    specularRoughnessMap: textureToTexImage2D(
      context,
      specularRoughnessTexture
    )
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );
    uniforms.pointLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 3,
      Math.cos(now * 0.002) * 2,
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
