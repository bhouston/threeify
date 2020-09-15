import {
  Attachment,
  boxGeometry,
  BufferBit,
  ClearState,
  DepthTestFunc,
  DepthTestState,
  Euler,
  Framebuffer,
  makeBufferGeometryFromGeometry,
  makeDepthAttachment,
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
} from "../../../lib";
import { fetchImage } from "../../../lib/textures/loaders";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);

  const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));
  const uvTestTexture = makeTexImage2DFromTexture(context, texture);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -1)),
    viewToScreen: makeMatrix4OrthographicSimple(1.5, new Vector2(), 0.1, 2.0, 1.0, canvasFramebuffer.aspectRatio),
    viewLightPosition: new Vector3(0, 0, 0),
    map: uvTestTexture,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  const whiteClearState = new ClearState(new Vector3(1, 1, 1), 1.0);

  const framebufferSize = new Vector2(1024, 1024);
  const depthAttachment = makeDepthAttachment(context, framebufferSize);
  const framebuffer = new Framebuffer(context);
  framebuffer.attach(Attachment.Depth, depthAttachment);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.001, now * 0.0033, now * 0.00077),
      uniforms.localToWorld,
    );
    uniforms.map = uvTestTexture;

    framebuffer.clear(BufferBit.All, whiteClearState);
    renderBufferGeometry(framebuffer, program, uniforms, bufferGeometry, depthTestState);

    uniforms.map = depthAttachment;
    canvasFramebuffer.clear(BufferBit.All, whiteClearState);
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry, depthTestState);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
