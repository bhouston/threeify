import { Float32Attribute } from "../../../lib/geometry/Attribute";
import { Geometry } from "../../../lib/geometry/Geometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Program, RenderingContext } from "../../../lib/renderers/webgl2";
import { BufferGeometry } from "../../../lib/renderers/webgl2/buffers/BufferGeometry";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

const geometry = new Geometry();
geometry.attributes.set("position", new Float32Attribute([0, 0.5, 0.5, -0.5, -0.5, -0.5], 2));
geometry.attributes.set("color", new Float32Attribute([1, 0, 0, 0, 1, 0, 0, 0, 1], 3));

const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
document.body.appendChild(canvasFramebuffer.canvas);

const bufferGeometry = new BufferGeometry(context, geometry);
const program = new Program(context, material);

canvasFramebuffer.renderBufferGeometry(program, {}, bufferGeometry);
