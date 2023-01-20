import {
  Color3,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  fetchImage,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  mat4PerspectiveFov,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  translation3ToMat4,
  Vec3,
  vec3Normalize
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 5, true);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/planets/moon_2k.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const map = makeTexImage2DFromTexture(context, texture);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToScreen: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    numPunctualLights: 3,
    punctualLightType: [0, 1, 2],
    punctualLightViewPosition: [
      new Vec3(-1, 0, 0),
      new Vec3(0, 0, 0),
      new Vec3()
    ],
    punctualLightViewDirection: [
      new Vec3(),
      new Vec3(0, 0, -1),
      vec3Normalize(new Vec3(0, -1, -1))
    ],
    punctualLightColor: [
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

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

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

  return null;
}

init();
