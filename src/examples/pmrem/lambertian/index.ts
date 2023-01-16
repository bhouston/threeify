import { passGeometry } from '../../../lib/geometry/primitives/passGeometry.js';
import { icosahedronGeometry } from '../../../lib/geometry/primitives/polyhedronGeometry.js';
import { ShaderMaterial } from '../../../lib/materials/ShaderMaterial.js';
import { Euler3 } from '../../../lib/math/Euler3.js';
import {
  euler3ToMat4,
  mat4PerspectiveFov,
  translation3ToMat4
} from '../../../lib/math/Mat4.Functions.js';
import { Mat4 } from '../../../lib/math/Mat4.js';
import { Vec2 } from '../../../lib/math/Vec2.js';
import { Vec3 } from '../../../lib/math/Vec3.js';
import { makeBufferGeometryFromGeometry } from '../../../lib/renderers/webgl/buffers/BufferGeometry.js';
import {
  DepthTestFunc,
  DepthTestState
} from '../../../lib/renderers/webgl/DepthTestState.js';
import { Attachment } from '../../../lib/renderers/webgl/framebuffers/Attachment.js';
import { Framebuffer } from '../../../lib/renderers/webgl/framebuffers/Framebuffer.js';
import { renderBufferGeometry } from '../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer.js';
import { makeProgramFromShaderMaterial } from '../../../lib/renderers/webgl/programs/Program.js';
import { RenderingContext } from '../../../lib/renderers/webgl/RenderingContext.js';
import {
  makeTexImage2DFromCubeTexture,
  makeTexImage2DFromEquirectangularTexture
} from '../../../lib/renderers/webgl/textures/TexImage2D.Functions.js';
import { TextureFilter } from '../../../lib/renderers/webgl/textures/TextureFilter.js';
import { TextureWrap } from '../../../lib/renderers/webgl/textures/TextureWrap.js';
import {
  cubeFaceTargets,
  CubeMapTexture
} from '../../../lib/textures/CubeTexture.js';
import { fetchImage } from '../../../lib/textures/loaders/Image.js';
import { Texture } from '../../../lib/textures/Texture.js';
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

    renderBufferGeometry(
      framebuffer,
      samplerProgram,
      samplerUniforms,
      samplerBufferGeometry
    );
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
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld
    );
    renderBufferGeometry(
      canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry,
      depthTestState
    );
  }

  animate();

  return null;
}

init();
