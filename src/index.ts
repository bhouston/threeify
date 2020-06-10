import { box } from "./geometry/primitives/Box";
import { fetchImage } from "./io/loaders/Image";
import { PhysicalMaterial } from "./materials/PhysicalMaterial";
import { ShaderMaterial } from "./materials/ShaderMaterial";
import { Color } from "./math/Color";
import { PerspectiveCamera } from "./nodes/cameras/PerspectiveCamera";
import { PointLight } from "./nodes/lights/PointLight";
import { Mesh } from "./nodes/Mesh";
import { Node } from "./nodes/Node";
import {
  Attachments,
  BlendState,
  ClearState,
  DepthTestState,
  MaskState,
  Program,
  RenderingContext,
  TexImage2D,
  VertexArrayObject,
  VertexAttributeGeometry,
} from "./renderers/webgl2";
import { Texture, TextureAccessor } from "./textures";

import debug_vertex from "./shaders/materials/debug/vertex.glsl";
import debug_fragment from "./shaders/materials/debug/fragment.glsl";

async function test(): Promise<void> {
  // setup webgl2
  const canvasElement = document.querySelector("#rendering-canvas") as HTMLCanvasElement;
  const context = new RenderingContext(canvasElement);

  // create texture
  const texture = new Texture(await fetchImage("./exocortex-logo.jpg"));

  // create material
  const pbrMaterial = new PhysicalMaterial();
  pbrMaterial.albedo.setFromHex(0x808080);
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

  const texImage2D = new TexImage2D(context, texture.image);
  console.log(texImage2D);

  const boxVertexAttributeGeometry = VertexAttributeGeometry.FromGeometry(context, mesh.geometry);
  console.log(boxVertexAttributeGeometry);

  // source code definition of material
  const shaderCodeMaterial = new ShaderMaterial(debug_vertex, debug_fragment);
  console.log(shaderCodeMaterial);
  const program = new Program(context, shaderCodeMaterial);
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
  const vertexArrayObject = new VertexArrayObject(program, boxVertexAttributeGeometry);
  console.log(vertexArrayObject);

  // test if states work
  context.blendState = new BlendState();
  context.clearState = new ClearState();
  context.depthTestState = new DepthTestState();
  context.maskState = new MaskState();
}

test();
