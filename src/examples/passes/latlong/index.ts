import {
  DepthTestFunc,
  DepthTestState,
  Euler,
  makeBufferGeometryFromGeometry,
  makeMatrix4Inverse,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Matrix4,
  passGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  TextureFilter,
  TextureWrap,
} from "../../../lib";
import { fetchImage } from "../../../lib/textures/loaders";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = passGeometry();
  const passMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  const garageTexture = new Texture(await fetchImage("/assets/textures/cube/garage/latLong.jpg"));
  garageTexture.wrapS = TextureWrap.Repeat;
  garageTexture.wrapT = TextureWrap.ClampToEdge;
  garageTexture.minFilter = TextureFilter.Linear;
  const debugTexture = new Texture(await fetchImage("/assets/textures/cube/debug/latLong.png"));
  debugTexture.wrapS = TextureWrap.Repeat;
  debugTexture.wrapT = TextureWrap.ClampToEdge;
  debugTexture.minFilter = TextureFilter.Linear;

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const garageMap = makeTexImage2DFromTexture(context, garageTexture);
  const debugMap = makeTexImage2DFromTexture(context, debugTexture);

  const passProgram = makeProgramFromShaderMaterial(context, passMaterial);
  const passUniforms = {
    viewToWorld: new Matrix4(),
    screenToView: makeMatrix4Inverse(makeMatrix4PerspectiveFov(45, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio)),
    latLongMap: garageMap,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();

    passUniforms.viewToWorld = makeMatrix4Inverse(
      makeMatrix4RotationFromEuler(new Euler(Math.sin(now * 0.0003), now * 0.0004, 0)),
    );
    passUniforms.latLongMap = Math.floor(now / 5000) % 2 === 0 ? garageMap : debugMap;

    renderBufferGeometry(canvasFramebuffer, passProgram, passUniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
