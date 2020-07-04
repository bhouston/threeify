import { transformGeometry } from "../../../lib/geometry/Geometry.Functions";
import { fetchOBJ } from "../../../lib/geometry/loaders/OBJ";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler, EulerOrder } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4Concatenation,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Scale,
  makeMatrix4Translation,
} from "../../../lib/math/Matrix4.Functions";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../lib/renderers/webgl/ClearState";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { AttachmentBits } from "../../../lib/renderers/webgl/framebuffers/AttachmentBits";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = (await fetchOBJ("/assets/models/cloth.obj"))[0];
  transformGeometry(
    geometry,
    makeMatrix4Concatenation(
      makeMatrix4Translation(new Vector3(0, -0.5, 0)),
      makeMatrix4Scale(new Vector3(10, 10, 10)),
    ),
  );
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);

  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  if (canvasFramebuffer.canvas instanceof HTMLCanvasElement) {
    document.body.appendChild(canvasFramebuffer.canvas);
  }
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -2.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),

    // lights
    pointLightViewPosition: new Vector3(0.0, 0, 0.0),
    pointLightColor: new Vector3(1, 1, 1).multiplyByScalar(30.0),
    pointLightRange: 6.0,

    // materials
    sheenIntensity: 1.0,
    sheenColor: new Vector3(0.3, 0.3, 1.0),
    sheenRoughness: 0.5,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  const blackClearState = new ClearState(new Vector3(0, 0, 0), 1.0);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(0.15 * Math.PI, now * 0.0002, 0, EulerOrder.XZY),
      uniforms.localToWorld,
    );
    uniforms.sheenRoughness = Math.cos(now * 0.0003) * 0.5 + 0.5;
    uniforms.pointLightViewPosition = new Vector3(Math.cos(now * 0.001) * 3.0, 2.0, 0.5);
    canvasFramebuffer.clear(AttachmentBits.All, blackClearState);
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
