import {
  boxGeometry,
  DepthTestState,
  DeviceOrientation,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  mat4Inverse,
  mat4Perspective,
  quatToMat4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  translation3ToMat4,
  Vec3
} from '@threeify/core';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/uv_grid_opengl.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -1)),
    viewToScreen: mat4Perspective(-0.25, 0.25, 0.25, -0.25, 0.1, 4),
    viewLightPosition: new Vec3(0, 0, 0),
    map: makeTexImage2DFromTexture(context, texture)
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = DepthTestState.Default;

  let deviceOrientation: DeviceOrientation | undefined;

  const body = document.getElementsByTagName('body')[0];
  body.addEventListener(
    'click',
    () => {
      if (deviceOrientation === undefined) {
        deviceOrientation = new DeviceOrientation();
      }
    },
    false
  );

  function animate(): void {
    requestAnimationFrame(animate);

    if (deviceOrientation !== undefined) {
      uniforms.localToWorld = mat4Inverse(
        quatToMat4(deviceOrientation.orientation)
      );
    }
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
