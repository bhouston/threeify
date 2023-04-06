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
  euler3ToMat4,
  Mat4,
  mat4Inverse,
  mat4Multiply,
  mat4PerspectiveFov,
  Sphere,
  sphereRandomSample,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import {
  getThreeJsHdriUrl as getThreeJsHdriUrl,
  ThreeJsHdri as ThreeJsHrdi
} from '../../utilities/threeHdris';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

let debugOutput = 0;
let numBounces = 12;
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    // space bar
    case ' ':
      debugOutput = (debugOutput + 1) % 3;
      break;
    case 'ArrowUp':
      numBounces = Math.min(numBounces + 1, 6);
      break;
    case 'ArrowDown':
      numBounces = Math.max(numBounces - 1, 0);
      break;
  }

  console.log('debugOutput', debugOutput, 'numBounces', numBounces);
});

async function init(): Promise<void> {
  const passMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );

  const context = createRenderingContext(document, 'framebuffer');

  const geometry = icosahedronGeometry(8, 5, true);
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
  const sphereSampler = new Sphere(new Vec3(0, 0, 0), 1);
  for (let i = 0; i < 40; i++) {
    sphereOrigins.push(sphereRandomSample(sphereSampler));
    sphereToWorlds.push(translation3ToMat4(sphereOrigins[i]));
    worldToSpheres.push(mat4Inverse(sphereToWorlds[i]));
    sphereRadii.push(0.3 * Math.random() + 0.05);
    sphereAlbedos.push(
      new Color3(Math.random() * 0.9, Math.random() * 0.9, Math.random() * 0.9)
    );
  }

  const uniforms = {
    viewToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, 2)),
    viewToClip: mat4PerspectiveFov(
      45,
      0.1,
      10,
      1,
      canvasFramebuffer.aspectRatio
    ),
    sphereOrigins,
    sphereToWorlds,
    worldToSpheres,
    sphereRadii,
    sphereAlbedos,
    iblWorldMap: cubeMap,
    debugOutput: debugOutput,
    numBounces
  };

  function animate(): void {
    requestAnimationFrame(animate);

    uniforms.worldToView = mat4Multiply(
      translation3ToMat4(new Vec3(0, 0.25, -2)),
      euler3ToMat4(orbit.euler),
      uniforms.worldToView
    );
    //console.log(mat4ToString(uniforms.worldToView));
    uniforms.viewToWorld = mat4Inverse(
      uniforms.worldToView,
      uniforms.viewToWorld
    );
    uniforms.viewToClip = mat4PerspectiveFov(
      45,
      0.1,
      10,
      orbit.zoom,
      canvasFramebuffer.aspectRatio
    );
    uniforms.debugOutput = debugOutput;
    uniforms.numBounces = numBounces;

    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      bufferGeometry,
      program,
      uniforms,
      depthTestState: DepthTestState.None,
      cullingState: CullingState.Front
    });

    orbit.update();
  }

  animate();
}

init();
