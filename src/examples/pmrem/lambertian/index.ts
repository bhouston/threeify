import { passGeometry } from '../../../lib/geometry/primitives/passGeometry';
import { icosahedronGeometry } from '../../../lib/geometry/primitives/polyhedronGeometry';
import { ShaderMaterial } from '../../../lib/materials/ShaderMaterial';
import { Euler } from '../../../lib/math/Euler';
import { Matrix4 } from '../../../lib/math/Matrix4';
import {
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
} from '../../../lib/math/Matrix4.Functions';
import { Vector2 } from '../../../lib/math/Vector2';
import { Vector3 } from '../../../lib/math/Vector3';
import { makeBufferGeometryFromGeometry } from '../../../lib/renderers/webgl/buffers/BufferGeometry';
import { DepthTestFunc, DepthTestState } from '../../../lib/renderers/webgl/DepthTestState';
import { Attachment } from '../../../lib/renderers/webgl/framebuffers/Attachment';
import { Framebuffer } from '../../../lib/renderers/webgl/framebuffers/Framebuffer';
import { renderBufferGeometry } from '../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer';
import { makeProgramFromShaderMaterial } from '../../../lib/renderers/webgl/programs/Program';
import { RenderingContext } from '../../../lib/renderers/webgl/RenderingContext';
import {
  makeTexImage2DFromCubeTexture,
  makeTexImage2DFromEquirectangularTexture,
} from '../../../lib/renderers/webgl/textures/TexImage2D.Functions';
import { TextureFilter } from '../../../lib/renderers/webgl/textures/TextureFilter';
import { TextureWrap } from '../../../lib/renderers/webgl/textures/TextureWrap';
import { cubeFaceTargets, CubeMapTexture } from '../../../lib/textures/CubeTexture';
import { fetchImage } from '../../../lib/textures/loaders/Image';
import { Texture } from '../../../lib/textures/Texture';
import fragmentSource from './fragment.glsl';
import { samplerMaterial } from './sampler/SamplerMaterial';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 2);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const garageTexture = new Texture(await fetchImage('/assets/textures/cube/garage/latLong.jpg'));
  garageTexture.wrapS = TextureWrap.Repeat;
  garageTexture.wrapT = TextureWrap.ClampToEdge;
  garageTexture.minFilter = TextureFilter.Linear;

  const imageSize = new Vector2(1024, 1024);
  const lambertianCubeTexture = new CubeMapTexture([imageSize, imageSize, imageSize, imageSize, imageSize, imageSize]);
  lambertianCubeTexture.minFilter = TextureFilter.Linear;
  lambertianCubeTexture.generateMipmaps = false;

  const context = new RenderingContext(document.getElementById('framebuffer') as HTMLCanvasElement);
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const envCubeMap = makeTexImage2DFromEquirectangularTexture(context, garageTexture, new Vector2(1024, 1024));

  const samplerGeometry = passGeometry();
  const samplerProgram = makeProgramFromShaderMaterial(context, samplerMaterial);
  const samplerUniforms = {
    envCubeMap,
    faceIndex: 0,
  };

  const samplerBufferGeometry = makeBufferGeometryFromGeometry(context, samplerGeometry);
  const lambertianCubeMap = makeTexImage2DFromCubeTexture(context, lambertianCubeTexture);

  const framebuffer = new Framebuffer(context);

  cubeFaceTargets.forEach((target, index) => {
    framebuffer.attach(Attachment.Color0, lambertianCubeMap, target, 0);
    samplerUniforms.faceIndex = index;

    renderBufferGeometry(framebuffer, samplerProgram, samplerUniforms, samplerBufferGeometry);
  });

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),
    cubeMap: lambertianCubeMap,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld,
    );
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
