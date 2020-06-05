import { boxGeometry } from './geometry/BoxGeometry.js';
import { fetchImage } from './io/loaders/Image.js';
import { ShaderCodeMaterial } from './materials/ShaderCodeMaterial.js';
import { Color } from './math/Color.js';
import { PerspectiveCamera } from './nodes/cameras/PerspectiveCamera.js';
import { PointLight } from './nodes/lights/PointLight.js';
import { Mesh } from './nodes/Mesh.js';
import { Node } from './nodes/Node.js';
import { BlendState } from './renderers/webgl2/BlendState.js';
import { ClearState } from './renderers/webgl2/ClearState.js';
import { RenderingContext } from './renderers/webgl2/RenderingContext.js';
import { DepthTestState } from './renderers/webgl2/DepthTestState.js';
import { MaskState } from './renderers/webgl2/MaskState.js';
import { Program } from './renderers/webgl2/Program.js';
import debug_fragment from './renderers/webgl2/shaders/materials/debug/fragment.glsl.js';
import debug_vertex from './renderers/webgl2/shaders/materials/debug/vertex.glsl.js';
import { TexImage2D } from './renderers/webgl2/TexImage2D.js';
import { VertexArrayObject } from './renderers/webgl2/VertexArrayObject.js';
import { VertexAttributeGeometry } from './renderers/webgl2/VertexAttributeGeometry.js';
import { Texture } from './textures/Texture.js';

async function test() {
	// setup webgl2
	let canvasElement = document.querySelector(
		'#rendering-canvas',
	) as HTMLCanvasElement;
	let context = new RenderingContext(canvasElement);

	//
	// create scene graph
	//

	let rootNode = new Node();

	let light = new PointLight();
	rootNode.children.add(light);

	let mesh = new Mesh(boxGeometry(1, 1, 1, 1, 1, 1));
	rootNode.children.add(mesh);

	let camera = new PerspectiveCamera(60, 1, 10);
	camera.position.x -= 5;
	rootNode.children.add(camera);

	let texture = new Texture(await fetchImage('./exocortex-logo.jpg'));
	console.log(texture);

	let texImage2D = new TexImage2D(context);
	texImage2D.update(texture);
	console.log(texImage2D);

	let boxVertexAttributeGeometry = VertexAttributeGeometry.FromGeometry(
		context,
		mesh.geometry,
	);
	console.log(boxVertexAttributeGeometry);

	// source code definition of material
	let shaderCodeMaterial = new ShaderCodeMaterial(debug_vertex, debug_fragment);
	console.log(shaderCodeMaterial);
	let program = new Program(context, shaderCodeMaterial);
	console.log(program);

	// using uniform set structures
	let materialUniforms = {
		albedo: new Color(1, 0.5, 0.5),
		albedoUvIndex: 0,
		albedoMap: texImage2D,
	};
	console.log(materialUniforms);
	let sceneUniforms = {
		localToWorldTransform: mesh.localToParentTransform,
		worldToViewTransform: camera.parentToLocalTransform,
		viewToScreenProjection: camera.getProjection(
			canvasElement.width / canvasElement.height,
		),
	};
	console.log(sceneUniforms);
	program.setUniformValues(materialUniforms);
	program.setUniformValues(sceneUniforms);

	// bind to program
	let vertexArrayObject = new VertexArrayObject(
		program,
		boxVertexAttributeGeometry,
	);
	console.log(vertexArrayObject);

	// test if states work
	context.blendState = new BlendState();
	context.clearState = new ClearState();
	context.depthTestState = new DepthTestState();
	context.maskState = new MaskState();
}

test();
