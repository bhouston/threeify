import {
  DepthTestFunc,
  DepthTestState,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeMatrix4PerspectiveFov,
  makeMatrix4Translation,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromEquirectangularTexture,
  Matrix4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
} from "../../../lib";
import { fetchImage } from "../../../lib/textures/loaders";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const debugTexture = new Texture(await fetchImage("/assets/textures/cube/debug/latLong.png"));

  const geometry = icosahedronGeometry(0.75, 4);
  const material = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const cubeMap = makeTexImage2DFromEquirectangularTexture(context, debugTexture, new Vector2(1024, 1024));

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),
    cubeMap: cubeMap,
    mipCount: cubeMap.mipCount,
    perceptualRoughness: 0,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    /* uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld,
    );*/
    uniforms.perceptualRoughness = Math.sin(now * 0.001) * 0.5 + 0.5;

    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
