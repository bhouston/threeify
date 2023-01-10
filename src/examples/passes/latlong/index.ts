import {
  DepthTestFunc,
  DepthTestState,
  fetchImage,
  makeBufferGeometryFromGeometry,
  mat4Inverse,
  mat4PerspectiveFov,
  makeMat4RotationFromQuat,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  Orbit,
  passGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  Texture,
  TextureFilter,
  TextureWrap
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = passGeometry();
  const passMaterial = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );

  let imageIndex = 0;

  const images = [];
  const textures: Texture[] = [];
  const texImage2Ds: TexImage2D[] = [];
  for (let i = 0; i < 5; i++) {
    images.push(
      fetchImage(`/assets/textures/cube/kitchen/kitchenb_${i + 1}.jpg`).then(
        (image) => {
          const texture = new Texture(image);
          texture.wrapS = TextureWrap.ClampToEdge;
          texture.wrapT = TextureWrap.ClampToEdge;
          texture.minFilter = TextureFilter.Linear;
          textures[i] = texture;

          texImage2Ds[i] = makeTexImage2DFromTexture(context, texture);
        }
      )
    );
  }

  await Promise.all(images);

  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbit = new Orbit(context.canvas);

  const passProgram = makeProgramFromShaderMaterial(context, passMaterial);
  const passUniforms = {
    viewToWorld: new Mat4(),
    screenToView: mat4Inverse(
      mat4PerspectiveFov(30, 0.1, 4, 1, canvasFramebuffer.aspectRatio)
    ),
    equirectangularMap: texImage2Ds[0]
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();

    passUniforms.viewToWorld = mat4Inverse(
      makeMat4RotationFromQuat(orbit.orientation)
    );
    passUniforms.screenToView = mat4Inverse(
      mat4PerspectiveFov(
        15 * (1 - orbit.zoom) + 15,
        0.1,
        4,
        1,
        canvasFramebuffer.aspectRatio
      )
    );
    passUniforms.equirectangularMap = texImage2Ds[imageIndex];

    renderBufferGeometry(
      canvasFramebuffer,
      passProgram,
      passUniforms,
      bufferGeometry,
      depthTestState
    );

    orbit.update();
  }

  animate();

  window.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== undefined) {
        imageIndex =
          (event.key.charCodeAt(0) - '0'.charCodeAt(0)) % images.length;
        // Handle the event with KeyboardEvent.key and set handled true.
      }
    },
    true
  );

  return null;
}

init();

window.addEventListener(
  'keydown',
  (event) => {
    if (event.defaultPrevented) {
      return; // Should do nothing if the default action has been cancelled
    }

    const handled = false;
    if (event.key !== undefined) {
      // Handle the event with KeyboardEvent.key and set handled true.
    } else if (event.keyCode !== undefined) {
      // Handle the event with KeyboardEvent.keyCode and set handled true.
    }

    if (handled) {
      // Suppress "double action" if event handled
      event.preventDefault();
    }
  },
  true
);
