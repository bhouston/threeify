import { boxGeometry } from "../../../lib/geometry/primitives/boxGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4OrthographicSimple,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
} from "../../../lib/math/Matrix4.Functions";
import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../lib/renderers/webgl/ClearState";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { AttachmentBits } from "../../../lib/renderers/webgl/framebuffers/AttachmentBits";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture, TexImage2D } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { makeTextureFromVideoElement, Texture } from "../../../lib/textures/Texture";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const program = makeProgramFromShaderMaterial(context, material);
  const clickToPlayTexture = new Texture(await fetchImage("/assets/textures/videos/ClickToPlay.png"));

  const clickToPlayMap = makeTexImage2DFromTexture(context, clickToPlayTexture);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -1)),
    viewToScreen: makeMatrix4OrthographicSimple(1.5, new Vector2(), 0.1, 2.0, 1.0, canvasFramebuffer.aspectRatio),
    viewLightPosition: new Vector3(0, 0, 0),
    map: clickToPlayMap,
  };

  const video = document.createElement("video");
  const source = document.createElement("source");
  source.type = "video/mp4";
  source.src = "/assets/textures/videos/sintel.mp4";
  video.appendChild(source);

  let videoMap: TexImage2D | null = null;

  const body = document.getElementsByTagName("body")[0];
  body.addEventListener(
    "click",
    async function (): Promise<void> {
      await video.play();
      video.currentTime = 3; // jump ahead to content
      const videoTexture = makeTextureFromVideoElement(video);
      videoMap = makeTexImage2DFromTexture(context, videoTexture);
      uniforms.map = videoMap;
    },
    false,
  );

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  const whiteClearState = new ClearState(new Vector3(1, 1, 1), 1.0);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.0001, now * 0.0013, now * 0.00077),
      uniforms.localToWorld,
    );
    if (videoMap !== null && video.readyState >= video.HAVE_CURRENT_DATA) {
      videoMap.loadImages([video]);
    }
    canvasFramebuffer.clear(AttachmentBits.All, whiteClearState);
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
