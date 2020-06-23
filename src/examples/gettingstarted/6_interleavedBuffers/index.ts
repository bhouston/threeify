import { makeFloat32Attribute, makeUint8Attribute } from "../../../lib/geometry/Attribute";
import { Geometry } from "../../../lib/geometry/Geometry";
import { convertToInterleavedGeometry } from "../../../lib/geometry/Geometry.Functions";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

let geometry = new Geometry();
geometry.attributes["position"] = makeFloat32Attribute([0, 0.5, 0.5, -0.5, -0.5, -0.5], 2);
geometry.attributes["color"] = makeUint8Attribute([255, 0, 0, 0, 255, 0, 0, 0, 255], 3, true);
geometry = convertToInterleavedGeometry(geometry);

const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
document.body.appendChild(canvasFramebuffer.canvas);

const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
const program = makeProgramFromShaderMaterial(context, material);
const uniforms = {};

canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);
