import {
  createRenderingContext,
  fetchTexture,
  geometryToBufferGeometry,
  icosahedronGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  textureToTexImage2D
} from '@threeify/core';
import {
  Color3,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec3,
  vec3Normalize
} from '@threeify/math';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const geometry = icosahedronGeometry(0.75, 5, true);
  const texture = await fetchTexture('/assets/textures/planets/moon_2k.jpg');

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const map = textureToTexImage2D(context, texture);
  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const uniforms = {
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

    // lights
    numPunctualLights: 3,
    punctualLightType: [0, 1, 2],
    punctualLightViewPosition: [new Vec3(-1, 0, 0), Vec3.Zero, new Vec3()],
    punctualLightViewDirection: [
      new Vec3(),
      new Vec3(0, 0, -1),
      vec3Normalize(new Vec3(0, -1, -1))
    ],
    punctualLightIntensity: [
      new Color3(60, 4, 4),
      new Color3(4, 30, 4),
      new Color3(0.1, 0.1, 1)
    ],
    punctualLightRange: [15, 15, 0],
    punctualLightInnerCos: [0, 0.95, 0],
    punctualLightOuterCos: [0, 0.9, 0],

    // materials
    albedoMap: map
  };

  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );
    uniforms.punctualLightViewDirection[2] = vec3Normalize(
      new Vec3(
        Math.cos(now * 0.001) * 0.5,
        Math.cos(now * 0.00087) * 0.5,
        Math.cos(now * 0.00045) * 0.5
      )
    );
    uniforms.punctualLightViewPosition[0] = new Vec3(
      Math.cos(now * 0.00097) * 5,
      Math.cos(now * 0.00082) * 5,
      1.5
    );
    uniforms.punctualLightInnerCos[1] = 1;
    uniforms.punctualLightOuterCos[1] = 0.97 + 0.025 * Math.cos(now * 0.0017);

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
