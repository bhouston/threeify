
import { icosahedronGeometry, ShaderMaterial, Texture, fetchImage, TextureWrap, TextureFilter, Vec2, CubeMapTexture, RenderingContext, makeTexImage2DFromEquirectangularTexture, passGeometry, makeProgramFromShaderMaterial, makeBufferGeometryFromGeometry, makeTexImage2DFromCubeTexture, Framebuffer, cubeFaceTargets, Attachment, renderBufferGeometry, Mat4, translation3ToMat4, Vec3, mat4PerspectiveFov, DepthTestState, euler3ToMat4, Euler3 } from '@threeify/core';
import fragmentSource from './fragment.glsl';
import { samplerMaterial } from './sampler/SamplerMaterial.js';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 2, true);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const garageTexture = new Texture(
    await fetchImage('/assets/textures/cube/garage/latLong.jpg')
  );
  garageTexture.wrapS = TextureWrap.Repeat;
  garageTexture.wrapT = TextureWrap.ClampToEdge;
  garageTexture.minFilter = TextureFilter.Linear;

  const imageSize = new Vec2(1024, 1024);
  const lambertianCubeTexture = new CubeMapTexture([
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize
  ]);
  lambertianCubeTexture.minFilter = TextureFilter.Linear;
  lambertianCubeTexture.generateMipmaps = false;

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const envCubeMap = makeTexImage2DFromEquirectangularTexture(
    context,
    garageTexture,
    new Vec2(1024, 1024)
  );

  const samplerGeometry = passGeometry();
  const samplerProgram = makeProgramFromShaderMaterial(
    context,
    samplerMaterial
  );
  const samplerUniforms = {
    envCubeMap,
    faceIndex: 0
  };

  const samplerBufferGeometry = makeBufferGeometryFromGeometry(
    context,
    samplerGeometry
  );
  const lambertianCubeMap = makeTexImage2DFromCubeTexture(
    context,
    lambertianCubeTexture
  );

  const framebuffer = new Framebuffer(context);

  cubeFaceTargets.forEach((target, index) => {
    framebuffer.attach(Attachment.Color0, lambertianCubeMap, target, 0);
    samplerUniforms.faceIndex = index;

    renderBufferGeometry({
      framebuffer,
      program: samplerProgram,
      uniforms: samplerUniforms,
      bufferGeometry: samplerBufferGeometry
    });
  });

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToScreen: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    cubeMap: lambertianCubeMap
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = DepthTestState.Default;

  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld
    );
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry
    });
  }

  animate();

  return null;
}

init();
