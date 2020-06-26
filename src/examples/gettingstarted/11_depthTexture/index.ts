import { box } from "../../../lib/geometry/primitives/Box";
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
import { makeDepthAttachment } from "../../../lib/renderers/webgl/framebuffers/Attachment";
import { AttachmentBits } from "../../../lib/renderers/webgl/framebuffers/AttachmentBits";
import { Framebuffer } from "../../../lib/renderers/webgl/framebuffers/Framebuffer";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  const canvas = canvasFramebuffer.canvas;
  if (canvas instanceof HTMLCanvasElement) {
    document.body.appendChild(canvas);
  }

  const geometry = box(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
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
  const framebuffer = new Framebuffer(context, [depthAttachment]);

  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.001, now * 0.0033, now * 0.00077),
      uniforms.localToWorld,
    );
    uniforms.map = uvTestTexture;

    framebuffer.clear(AttachmentBits.All, whiteClearState);
    framebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);

    uniforms.map = depthAttachment.texImage2D;
    canvasFramebuffer.clear(AttachmentBits.All, whiteClearState);
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
