import { Float32Attribute } from "../../../lib/geometry/Attribute";
import { Geometry } from "../../../lib/geometry/Geometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Color } from "../../../lib/math/Color";
import { Program, RenderingContext } from "../../../lib/renderers/webgl2";
import { BufferGeometry } from "../../../lib/renderers/webgl2/buffers/BufferGeometry";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

const geometry = new Geometry();
geometry.attributes.set("position", new Float32Attribute([0, 0.5, 0.5, -0.5, -0.5, -0.5], 2));

const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
document.body.appendChild(canvasFramebuffer.canvas);

const bufferGeometry = new BufferGeometry(context, geometry);
const program = new Program(context, material);
const uniforms = { scale: 1.0, color: new Color() };

canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);

function animate(): void {
  requestAnimationFrame(animate);
  uniforms.scale = 0.6 + 0.4 * Math.cos(Date.now() * 0.001);
  uniforms.color.setFromHSL(Date.now() * 0.001, 1.0, 0.5);
  canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);
}

animate();
