import { box } from "../../../lib/geometry/primitives/Box";
import { fetchImage } from "../../../lib/io/loaders/Image";
import { PhysicalMaterial } from "../../../lib/materials/PhysicalMaterial";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Color } from "../../../lib/math/Color";
import { makeColorFromHex } from "../../../lib/math/Color.Functions";
import { PerspectiveCamera } from "../../../lib/nodes/cameras/PerspectiveCamera";
import { PointLight } from "../../../lib/nodes/lights/PointLight";
import { Mesh } from "../../../lib/nodes/Mesh";
import { Node } from "../../../lib/nodes/Node";
import { BlendState } from "../../../lib/renderers/webgl/BlendState";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../lib/renderers/webgl/ClearState";
import { DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { Attachments } from "../../../lib/renderers/webgl/framebuffers/Attachments";
import { MaskState } from "../../../lib/renderers/webgl/MaskState";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { VertexArrayObject } from "../../../lib/renderers/webgl/VertexArrayObject";
import debug_fragment from "../../../lib/shaders/materials/pbr/fragment.glsl";
import debug_vertex from "../../../lib/shaders/materials/pbr/vertex.glsl";
import { Texture } from "../../../lib/textures/Texture";
import { TextureAccessor } from "../../../lib/textures/TextureAccessor";

async function test(): Promise<void> {
  // setup webgl2
  const canvasElement = document.querySelector("#rendering-canvas") as HTMLCanvasElement;
  const context = new RenderingContext(canvasElement);

  // create texture
  const texture = new Texture(await fetchImage("./exocortex-logo.jpg"));

  // create material
  const pbrMaterial = new PhysicalMaterial();
  pbrMaterial.albedo = makeColorFromHex(new Color(), 0x808080);
  pbrMaterial.albedoMap = new TextureAccessor(texture);

  // create scene graph
  const rootNode = new Node();

  const light = new PointLight();
  rootNode.children.add(light);

  const mesh = new Mesh(box(1, 1, 1, 1, 1, 1), pbrMaterial);
  rootNode.children.add(mesh);

  const camera = new PerspectiveCamera(60, 1, 10);
  camera.position.x -= 5;
  rootNode.children.add(camera);

  // render to the screen
  const canvasFramebuffer = context.canvasFramebuffer;
  const depthClear = new ClearState(new Color(0, 0, 0), 0);
  canvasFramebuffer.clear(Attachments.Default, depthClear);
  canvasFramebuffer.render(rootNode, camera);

  const texImage2D = makeTexImage2DFromTexture(context, texture);
  console.log(texImage2D);

  const boxBufferGeometry = makeBufferGeometryFromGeometry(context, mesh.geometry);
  console.log(boxBufferGeometry);

  // source code definition of material
  const shaderCodeMaterial = new ShaderMaterial(debug_vertex, debug_fragment);
  console.log(shaderCodeMaterial);
  const program = makeProgramFromShaderMaterial(context, shaderCodeMaterial);
  console.log(program);

  // using uniform set structures
  const materialUniforms = {
    albedo: new Color(1, 0.5, 0.5),
    albedoUvIndex: 0,
    albedoMap: texImage2D,
  };
  console.log(materialUniforms);
  const sceneUniforms = {
    localToWorldTransform: mesh.localToParentTransform,
    worldToViewTransform: camera.parentToLocalTransform,
    viewToScreenProjection: camera.getProjection(canvasElement.width / canvasElement.height),
  };
  console.log(sceneUniforms);
  program.setUniformValues(materialUniforms);
  program.setUniformValues(sceneUniforms);

  // bind to program
  const vertexArrayObject = new VertexArrayObject(program, boxBufferGeometry);
  console.log(vertexArrayObject);

  // test if states work
  context.blendState = new BlendState();
  context.clearState = new ClearState();
  context.depthTestState = new DepthTestState();
  context.maskState = new MaskState();
}

test();
