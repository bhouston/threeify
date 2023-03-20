import {
  AbbeConstants,
  createRenderingContext,
  equirectangularTextureToCubeMap,
  fetchHDR,
  fetchOBJ,
  geometryToBufferGeometry,
  InternalFormat,
  IORConstants,
  renderBufferGeometry,
  shaderSourceToProgram,
  Texture,
  TextureEncoding
} from '@threeify/core';
import {
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../utilities/threejsHDRIs';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const [geometry] = await fetchOBJ('/assets/models/gems/gemStone.obj');

  //outputDebugInfo(geometry);
  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );

  const latLongTexture = new Texture(
    await fetchHDR(getThreeJSHDRIUrl(ThreeJSHRDI.royal_esplanade_1k))
  );
  const cubeMap = await equirectangularTextureToCubeMap(
    context,
    latLongTexture,
    TextureEncoding.RGBE,
    1024,
    InternalFormat.RGBA16F
  );

  const uniforms = {
    // ibl
    iblMapTexture: cubeMap,
    iblMapIntensity: 1,
    iblMapMaxLod: cubeMap.mipCount,

    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToClip: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // material
    ior: IORConstants.Diamond,
    transmissionFactor: 0.5,
    attenuationDistance: 0.5,
    attenuationColor: new Vec3(1, 1, 1),
    abbeNumber: AbbeConstants.Diamond
  };

  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
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
