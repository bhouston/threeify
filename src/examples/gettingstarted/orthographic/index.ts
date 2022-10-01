import {
  boxGeometry,
  DepthTestFunc,
  DepthTestState,
  Euler,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeMatrix4OrthographicSimple,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Matrix4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
} from "../../../lib/index";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const { canvasFramebuffer } = context;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -1)),
    viewToScreen: makeMatrix4OrthographicSimple(1.5, new Vector2(), 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),
    viewLightPosition: new Vector3(0, 0, 0),
    map: makeTexImage2DFromTexture(context, texture),
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.001, now * 0.0033, now * 0.00077),
      uniforms.localToWorld,
    );
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry, depthTestState);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
