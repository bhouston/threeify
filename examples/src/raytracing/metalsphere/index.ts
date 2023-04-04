import {
  createRenderingContext,
  CullingState,
  DepthTestState,
  equirectangularTextureToCubeMap,
  fetchHDR,
  geometryToBufferGeometry,
  icosahedronGeometry,
  InternalFormat,
  Orbit,
  renderBufferGeometry,
  ShaderMaterial,
  shaderMaterialToProgram,
  Texture,
  TextureEncoding
} from '@threeify/core';
import {
  Color3,
  Mat4,
  mat4Inverse,
  mat4PerspectiveFov,
  Sphere,
  sphereRandomSample,
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

  const geometry = icosahedronGeometry(1, 5, true);
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

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

  const program = await shaderMaterialToProgram(context, passMaterial);

  const sphereOrigins: Vec3[] = [];
  const sphereToWorlds: Mat4[] = [];
  const worldToSpheres: Mat4[] = [];
  const sphereRadii: number[] = [];
  const sphereAlbedos: Color3[] = [];
  const sphereSampler = new Sphere(new Vec3(0, 0, 0), 0.25);
  for (let i = 0; i < 10; i++) {
    sphereOrigins.push(sphereRandomSample(sphereSampler));
    sphereToWorlds.push(translation3ToMat4(sphereOrigins[i]));
    worldToSpheres.push(mat4Inverse(sphereToWorlds[i]));
    sphereRadii.push(0.05);
    sphereAlbedos.push(new Color3(Math.random(), Math.random(), Math.random()));
  }

  const uniforms = {
    viewToWorld: translation3ToMat4(new Vec3(0, 0, -2)),
    worldToView: new Mat4(),
    clipToView: mat4Inverse(
      mat4PerspectiveFov(45, 0.1, 10, 1, canvasFramebuffer.aspectRatio)
    ),
    sphereOrigins,
    sphereToWorlds,
    worldToSpheres,
    sphereRadii,
    sphereAlbedos,
    iblWorldMap: cubeMap,
    debugOutput: debugOutput
  };

  function animate(): void {
    requestAnimationFrame(animate);

    uniforms.viewToWorld = translation3ToMat4(new Vec3(0, 0.25, -2));
    uniforms.worldToView = mat4Inverse(uniforms.viewToWorld);
    uniforms.clipToView = mat4Inverse(
      mat4PerspectiveFov(45, 0.1, 10, orbit.zoom, canvasFramebuffer.aspectRatio)
    );
    uniforms.debugOutput = debugOutput;

    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      bufferGeometry,
      program,
      uniforms,
      depthTestState: DepthTestState.None,
      cullingState: CullingState.None
    });

    orbit.update();
  }

  animate();
}

init();
