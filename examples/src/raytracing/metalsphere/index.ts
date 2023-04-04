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

  const sphereToWorlds: Mat4[] = [];
  const worldToSpheres: Mat4[] = [];
  const sphereRadii: number[] = [];
  const sphereAlbedos: Color3[] = [];
  for (let i = 0; i < 10; i++) {
    sphereToWorlds.push(
      translation3ToMat4(
        new Vec3(
          (Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3)
        )
      )
    );
    worldToSpheres.push(mat4Inverse(sphereToWorlds[i]));
    sphereRadii.push(0.05);
    sphereAlbedos.push(new Color3(Math.random(), Math.random(), Math.random()));
  }

  const passUniforms = {
    viewToWorld: translation3ToMat4(new Vec3(0, 0, -2)),
    worldToView: new Mat4(),
    clipToView: mat4Inverse(
      mat4PerspectiveFov(45, 0.1, 4, 1, canvasFramebuffer.aspectRatio)
    ),
    sphereToWorlds,
    worldToSpheres,
    sphereRadii,
    sphereAlbedos,
    iblWorldMap: cubeMap,
    debugOutput: debugOutput
  };

  function animate(): void {
    requestAnimationFrame(animate);

    passUniforms.viewToWorld = mat4Multiply(
      translation3ToMat4(new Vec3(0, 0.25, -2)),
      mat4Inverse(quatToMat4(orbit.rotation))
    );
    passUniforms.worldToView = mat4Inverse(passUniforms.viewToWorld);
    passUniforms.clipToView = mat4Inverse(
      mat4PerspectiveFov(45, 0.1, 4, orbit.zoom, canvasFramebuffer.aspectRatio)
    );
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
