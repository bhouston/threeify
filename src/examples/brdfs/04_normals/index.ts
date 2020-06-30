import { icosahedron } from "../../../lib/geometry/primitives/polyhedrons";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler, EulerOrder } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
} from "../../../lib/math/Matrix4.Functions";
import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = icosahedron(0.75, 5);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const normalsTexture = new Texture(await fetchImage("/assets/textures/golfball/normals.jpg"));

  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  if (canvasFramebuffer.canvas instanceof HTMLCanvasElement) {
    document.body.appendChild(canvasFramebuffer.canvas);
  }
  const normalsMap = makeTexImage2DFromTexture(context, normalsTexture);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -1.0)),
    viewToScreen: makeMatrix4PerspectiveFov(65, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),

    // lights
    pointLightViewPosition: new Vector3(0.0, 0, 0.0),
    pointLightColor: new Vector3(1, 1, 1).multiplyByScalar(2.9),
    pointLightRange: 6.0,

    // materials
    normalModulator: new Vector2(1, 1),
    normalMap: normalsMap,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(Math.PI * Math.cos( now * 0.00034), -now * 0.0006, 0, EulerOrder.YXZ),
      uniforms.localToWorld,
    );
    uniforms.pointLightViewPosition = new Vector3(Math.cos(now * 0.001) * 2.0, 0, 1.5);
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
