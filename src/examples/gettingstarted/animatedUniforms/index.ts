import { makeFloat32Attribute, makeUint32Attribute } from "../../../lib/geometry/Attribute";
import { Geometry } from "../../../lib/geometry/Geometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeColor3FromHSL } from "../../../lib/math/Vector3.Functions";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { renderBufferGeometry } from "../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

const geometry = new Geometry();
geometry.attributes["position"] = makeFloat32Attribute([0, 0.5, 0.5, -0.5, -0.5, -0.5], 2);
geometry.indices = makeUint32Attribute([0, 1, 2], 1);

const material = new ShaderMaterial(vertexSource, fragmentSource);

const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
const canvasFramebuffer = context.canvasFramebuffer;
window.addEventListener("resize", () => canvasFramebuffer.resize());

const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
const program = makeProgramFromShaderMaterial(context, material);
const uniforms = { scale: 1.0, color: new Vector3() };

function animate(): void {
  requestAnimationFrame(animate);

  uniforms.scale = 0.6 + 0.4 * Math.cos(Date.now() * 0.001);
  uniforms.color = makeColor3FromHSL(Date.now() * 0.001, 1.0, 0.5, uniforms.color);

  renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);
}

animate();
