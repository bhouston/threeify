import {
  boxGeometry,
  BufferBit,
  ClearState,
  DepthTestFunc,
  DepthTestState,
  Euler,
  makeBufferGeometryFromGeometry,
  makeColor3FromHSL,
  makeHexStringFromColor3,
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

function updateCanvas(ctx: CanvasRenderingContext2D | null, frameNumber: number): void {
  if (ctx === null) {
    return;
  }
  const grd = ctx.createLinearGradient(0, 0, 256, frameNumber % 256);
  grd.addColorStop(0, "#" + makeHexStringFromColor3(makeColor3FromHSL(frameNumber / 256, 0.5, 0.5)));
  grd.addColorStop(1, "#" + makeHexStringFromColor3(makeColor3FromHSL(frameNumber / 193, 0.5, 0.5)));

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.font = "30px Arial";
  ctx.fillText("Canvas Texture", 128, 100);
  ctx.fillText(`Frame #${frameNumber}`, 128, 156);
}
async function init(): Promise<null> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  canvas.style.display = "none";
  const ctx = canvas.getContext("2d");

  const texture = new Texture(canvas);
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

  let frameNumber = 0;
  function animate(): void {
    frameNumber++;
    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.001, now * 0.0033, now * 0.00077),
      uniforms.localToWorld,
    );
    updateCanvas(ctx, frameNumber);
    uvTestTexture.loadImages([canvas]);
    uniforms.map = uvTestTexture;

    canvasFramebuffer.clear(BufferBit.All, whiteClearState);
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry, depthTestState);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
