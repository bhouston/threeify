import {
  createRenderingContext,
  fetchImage,
  Orbit,
  renderPass,
  ShaderMaterial,
  shaderMaterialToProgram,
  TexImage2D,
  Texture,
  TextureFilter,
  textureToTexImage2D,
  TextureWrap
} from '@threeify/core';
import {
  Mat4,
  mat4Inverse,
  mat4PerspectiveFov,
  quatToMat4
} from '@threeify/math';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const passMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );

  const context = createRenderingContext(document, 'framebuffer');

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
          return (texImage2Ds[i] = textureToTexImage2D(context, texture));
        }
      )
    );
  }

  await Promise.all(images);

  const { canvasFramebuffer, canvas } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbit = new Orbit(canvas);

  const passProgram = await shaderMaterialToProgram(context, passMaterial);
  const passUniforms = {
    viewToWorld: new Mat4(),
    clipToView: mat4Inverse(
      mat4PerspectiveFov(30, 0.1, 4, 1, canvasFramebuffer.aspectRatio)
    ),
    equirectangularMap: texImage2Ds[0]
  };

  function animate(): void {
    requestAnimationFrame(animate);

    passUniforms.viewToWorld = mat4Inverse(quatToMat4(orbit.rotation));
    passUniforms.clipToView = mat4Inverse(
      mat4PerspectiveFov(
        15 * (1 - orbit.zoom) + 15,
        0.1,
        4,
        1,
        canvasFramebuffer.aspectRatio
      )
    );
    passUniforms.equirectangularMap = texImage2Ds[imageIndex];

    renderPass({
      framebuffer: canvasFramebuffer,
      program: passProgram,
      uniforms: passUniforms
    });

    orbit.update();
  }

  animate();

  window.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== undefined) {
        imageIndex =
          ((event.key.codePointAt(0) || 0) - ('0'.codePointAt(0) || 0)) %
          images.length;
        // Handle the event with KeyboardEvent.key and set handled true.
      }
    },
    true
  );
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
