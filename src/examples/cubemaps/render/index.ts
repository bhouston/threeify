import {
  Attachment,
  Color3,
  cubeFaceTargets,
  CubeMapTexture,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  Framebuffer,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeColor3FromHSL,
  makeMat4PerspectiveFov,
  makeMat4RotationFromEuler,
  makeMat4Translation,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromCubeTexture,
  Mat4,
  passGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TextureFilter,
  Vec3,
  Vec2
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import { patternMaterial } from './pattern/PatternMaterial.js';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  // TODO: Required because of a timing error on Threeify.org website.  Fix this.
  // const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const geometry = icosahedronGeometry(0.75, 4);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const imageSize = new Vec2(1024, 1024);
  const cubeTexture = new CubeMapTexture([
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize
  ]);
  cubeTexture.minFilter = TextureFilter.Linear;
  cubeTexture.generateMipmaps = false;

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const patternGeometry = passGeometry();
  const patternProgram = makeProgramFromShaderMaterial(
    context,
    patternMaterial
  );
  const patternUniforms = {
    color: new Color3(1, 0, 0)
  };

  const patternBufferGeometry = makeBufferGeometryFromGeometry(
    context,
    patternGeometry
  );
  const cubeMap = makeTexImage2DFromCubeTexture(context, cubeTexture);

  const framebuffer = new Framebuffer(context);

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: makeMat4Translation(new Vec3(0, 0, -3)),
    viewToScreen: makeMat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    cubeMap
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    cubeFaceTargets.forEach((target, index) => {
      framebuffer.attach(Attachment.Color0, cubeMap, target, 0);
      patternUniforms.color = makeColor3FromHSL(
        index / 6 + now * 0.0001,
        0.5,
        0.5
      );

      renderBufferGeometry(
        framebuffer,
        patternProgram,
        patternUniforms,
        patternBufferGeometry
      );
    });

    uniforms.localToWorld = makeMat4RotationFromEuler(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld
    );
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
