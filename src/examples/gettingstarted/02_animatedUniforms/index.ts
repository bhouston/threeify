import { makeFloat32Attribute, makeUint32Attribute } from "../../../lib/geometry/Attribute";
import { Geometry } from "../../../lib/geometry/Geometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeColor3FromHSL } from "../../../lib/math/Vector3.Functions";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

const geometry = new Geometry();
geometry.attributes["position"] = makeFloat32Attribute([0, 0.5, 0.5, -0.5, -0.5, -0.5], 2);
geometry.indices = makeUint32Attribute([0, 1, 2], 1);

const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
if (canvasFramebuffer.canvas instanceof HTMLCanvasElement) {
  document.body.appendChild(canvasFramebuffer.canvas);
}
const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
const program = makeProgramFromShaderMaterial(context, material);
const uniforms = { scale: 1.0, color: new Vector3() };

function animate(): void {
  requestAnimationFrame(animate);

  uniforms.scale = 0.6 + 0.4 * Math.cos(Date.now() * 0.001);
  uniforms.color = makeColor3FromHSL(Date.now() * 0.001, 1.0, 0.5, uniforms.color);
  canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);
}

animate();
