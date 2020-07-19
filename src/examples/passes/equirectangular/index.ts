import { passGeometry } from "../../../lib/geometry/primitives/passGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4Inverse,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
} from "../../../lib/math/Matrix4.Functions";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { TextureFilter } from "../../../lib/renderers/webgl/textures/TextureFilter";
import { TextureWrap } from "../../../lib/renderers/webgl/textures/TextureWrap";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = passGeometry();
  const passMaterial = new ShaderMaterial(vertexSource, fragmentSource);
  const garageTexture = new Texture(await fetchImage("/assets/textures/cube/garage/equirectangular.jpg"));
  garageTexture.wrapS = TextureWrap.Repeat;
  garageTexture.wrapT = TextureWrap.ClampToEdge;
  garageTexture.minFilter = TextureFilter.Linear;
  const debugTexture = new Texture(await fetchImage("/assets/textures/cube/debug/equirectangular.png"));
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
    equirectangularMap: garageMap,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    passUniforms.viewToWorld = makeMatrix4Inverse(makeMatrix4RotationFromEuler(new Euler(0, now * 0.0004, 0)));
    passUniforms.equirectangularMap = Math.floor(now / 5000) % 2 === 0 ? garageMap : debugMap;

    canvasFramebuffer.renderBufferGeometry(passProgram, passUniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
