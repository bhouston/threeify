import {
  createRenderingContext,
  equirectangularTextureToCubeMap,
  fetchHDR,
  InternalFormat,
  Orbit,
  renderPass,
  ShaderMaterial,
  shaderMaterialToProgram,
  Texture,
  TextureEncoding
} from '@threeify/core';
import {
  Color3,
  Euler3,
  euler3ToMat4,
  Mat4,
  mat4Inverse,
  mat4Multiply,
  mat4PerspectiveFov,
  quatToMat4,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import {
  getThreeJsHdriUrl as getThreeJsHdriUrl,
  ThreeJsHdri as ThreeJsHrdi
} from '../../utilities/threeJsHdris';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

let debugOutput = 0;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    // space bar
    case ' ':
      debugOutput = (debugOutput + 1) % 3;
      break;
  }

  console.log('debugOutput', debugOutput);
});

async function init(): Promise<void> {
  const passMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );

  const context = createRenderingContext(document, 'framebuffer');

  const latLongTexture = new Texture(
    await fetchHDR(getThreeJsHdriUrl(ThreeJsHrdi.san_giuseppe_bridge_2k))
  );
  const cubeMap = await equirectangularTextureToCubeMap(
    context,
    latLongTexture,
    TextureEncoding.RGBE,
    1024,
    InternalFormat.RGBA16F
  );

  const { canvasFramebuffer, canvas } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbit = new Orbit(canvas);

  const passProgram = await shaderMaterialToProgram(context, passMaterial);

  const passUniforms = {
    viewToWorld: translation3ToMat4(new Vec3(0, 0, -2)),
    worldToView: new Mat4(),
    clipToView: mat4Inverse(
      mat4PerspectiveFov(45, 0.1, 4, 1, canvasFramebuffer.aspectRatio)
    ),
    planeToWorld: mat4Multiply(
      translation3ToMat4(new Vec3(0, 0, -0.125)),
      euler3ToMat4(new Euler3(Math.PI * 0.5, 0, 0))
    ),
    worldToPlane: new Mat4(),
    planeAlbedo: new Color3(0.5, 0.5, 0),
    sphereToWorld: translation3ToMat4(new Vec3(0, 0, 0)),
    worldToSphere: new Mat4(),
    sphereRadius: 0.125,
    sphereRoughness: 0,
    sphereAlbedo: new Color3(0.5, 0.5, 0.5),
    iblWorldMap: cubeMap,
    debugOutput: debugOutput
  };

  function animate(): void {
    requestAnimationFrame(animate);

    passUniforms.viewToWorld = mat4Multiply(
      translation3ToMat4(new Vec3(0, 0, -2)),
      mat4Inverse(quatToMat4(orbit.rotation))
    );
    passUniforms.worldToView = mat4Inverse(passUniforms.viewToWorld);
    passUniforms.clipToView = mat4Inverse(
      mat4PerspectiveFov(45, 0.1, 4, orbit.zoom, canvasFramebuffer.aspectRatio)
    );
    passUniforms.worldToPlane = mat4Inverse(passUniforms.planeToWorld);
    passUniforms.worldToSphere = mat4Inverse(passUniforms.sphereToWorld);
    passUniforms.debugOutput = debugOutput;

    renderPass({
      framebuffer: canvasFramebuffer,
      program: passProgram,
      uniforms: passUniforms
    });

    orbit.update();
  }

  animate();
}

init();
