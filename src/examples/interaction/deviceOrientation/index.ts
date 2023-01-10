import {
  boxGeometry,
  DepthTestFunc,
  DepthTestState,
  DeviceOrientation,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeMat4Inverse,
  makeMat4Perspective,
  makeMat4RotationFromQuat,
  translation3ToMat4,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vec3
} from '../../../lib/index.js';
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
    viewToScreen: makeMat4Perspective(-0.25, 0.25, 0.25, -0.25, 0.1, 4),
    viewLightPosition: new Vec3(0, 0, 0),
    map: makeTexImage2DFromTexture(context, texture)
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

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
      uniforms.localToWorld = makeMat4Inverse(
        makeMat4RotationFromQuat(deviceOrientation.orientation)
      );
    }
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
