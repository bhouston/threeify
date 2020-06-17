import { Float32AttributeAccessor } from "../../../lib/geometry/AttributeAccessor";
import { Geometry } from "../../../lib/geometry/Geometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { RenderingContext } from "../../../lib/renderers/webgl2";
import { BufferGeometry } from "../../../lib/renderers/webgl2/buffers/BufferGeometry";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

// create triangle buffers.

function createGeometry(): Geometry {
  const positions: Float32Array = new Float32Array([0, 0.5, 0.5, -0.5, -0.5, -0.5]);
  const colors: Float32Array = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  // const indices: Int32Array = new Int32Array([0, 1, 2]);

  const positionAttribute = new Float32AttributeAccessor(positions, 2);
  const colorsAttribute = new Float32AttributeAccessor(colors, 3);
  // const indicesAttribute = new Int32AttributeAccessor(indices, 3);

  const triangleGeometry = new Geometry();
  triangleGeometry.attributeAccessors.set("position", positionAttribute);
  triangleGeometry.attributeAccessors.set("color", colorsAttribute);
  // triangleGeometry.indices = indicesAttribute;

  return triangleGeometry;
}

const geometry = createGeometry();
const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);

const context = new RenderingContext();
const canvasFramebuffer = context.canvasFramebuffer;
document.body.appendChild(canvasFramebuffer.canvas);

const bufferGeometry = BufferGeometry.FromAttributeGeometry(context, geometry);
const program = context.programPool.request(material);

canvasFramebuffer.renderBufferGeometry(program, {}, bufferGeometry);
