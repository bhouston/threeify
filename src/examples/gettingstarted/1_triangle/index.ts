import { makeFloat32Attribute, makeUint8Attribute } from "../../../lib/geometry/Attribute";
import { Geometry } from "../../../lib/geometry/Geometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { BufferGeometry } from "../../../lib/renderers/webgl2/buffers/BufferGeometry";
import { Program } from "../../../lib/renderers/webgl2/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl2/RenderingContext";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

const geometry = new Geometry();
geometry.attributes["position"] = makeFloat32Attribute([0, 0.5, 0.5, -0.5, -0.5, -0.5], 2);
geometry.attributes["color"] = makeUint8Attribute([255, 0, 0, 0, 255, 0, 0, 0, 255], 3, true);

const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
document.body.appendChild(canvasFramebuffer.canvas);

const bufferGeometry = new BufferGeometry(context, geometry);
const program = new Program(context, material);
const uniforms = {};

canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);
