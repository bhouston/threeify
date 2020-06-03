import {
	Float32AttributeAccessor,
	Int16AttributeAccessor,
} from './core/AttributeAccessor.js';
import { Geometry } from './core/Geometry.js';
import { boxGeometry } from './geometry/BoxGeometry.js';
import { fetchImage } from './io/loaders/Image.js';
import { ShaderCodeMaterial } from './materials/ShaderCodeMaterial.js';
import { Matrix4 } from './math/Matrix4.js';
import { Vector3 } from './math/Vector3.js';
import { PointLight } from './nodes/lights/PointLight.js';
import { Mesh } from './nodes/Mesh.js';
import { Node } from './nodes/Node.js';
import { Context } from './renderers/webgl2/Context.js';
import { Program } from './renderers/webgl2/Program.js';
import { TextureImage2D } from './renderers/webgl2/TextureImage2D.js';
import { VertexArrayObject } from './renderers/webgl2/VertexArrayObject.js';
import { VertexAttributeGeometry } from './renderers/webgl2/VertexAttributeGeometry.js';
import { Texture } from './textures/Texture.js';
import { Color } from './math/Color.js';

async function test() {
	let a = new Vector3(1, 0, 0);
	let b = new Vector3(3, 2, 3);
	//let e = new Vector3( 3, 'ben', 3 ); // a type bug, uncomment to see how it is caught automatically.

	let m = new Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 0);

	console.log(a);
	a.applyMatrix4(m);
	console.log(a);
	let c = a.add(b).dot(b);
	console.log(c);

	let vs = `#version 300 es

	// an attribute is an input (in) to a vertex shader.
	// It will receive data from a buffer
	in vec2 position;

	// Used to pass in the resolution of the canvas
	uniform vec2 u_resolution;

	// all shaders have a main function
	void main() {

	// convert the position from pixels to 0.0 to 1.0
	vec2 zeroToOne = position / u_resolution;

	// convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// convert from 0->2 to -1->+1 (clipspace)
	vec2 clipSpace = zeroToTwo - 1.0;

	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
	}
	`;

	var fs = `#version 300 es

	precision highp float;

	uniform vec4 u_color;

	// we need to declare an output for the fragment shader
	out vec4 outColor;

	void main() {
	outColor = u_color;
	}
	`;

	// main memory representation setup

	let indexAccessor = new Int16AttributeAccessor(
		new Int16Array([0, 1, 2, 0, 2, 3]),
		1,
	);

	let positionAccessor = new Float32AttributeAccessor(
		new Float32Array([
			0.0,
			0.0,
			0.0,
			1.0,
			0.0,
			0.0,
			1.0,
			1.0,
			0.0,
			0.0,
			1.0,
			0.0,
		]),
		3,
	);

	let normalAccessor = new Float32AttributeAccessor(
		new Float32Array([
			0.0,
			0.0,
			1.0,
			0.0,
			0.0,
			1.0,
			0.0,
			0.0,
			1.0,
			0.0,
			0.0,
			1.0,
		]),
		3,
	);

	let uvAccessor = new Float32AttributeAccessor(
		new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
		2,
	);

	let geometry = new Geometry();
	geometry.setIndices(indexAccessor);
	geometry.setAttribute('position', positionAccessor);
	geometry.setAttribute('normal', normalAccessor);
	geometry.setAttribute('uv', uvAccessor);
	console.log(geometry);

	// setup webgl2
	let canvasElement = document.querySelector(
		'#rendering-canvas',
	) as HTMLCanvasElement;
	let context = new Context(canvasElement);

	// upload to GPU
	let vertexAttributeGeometry = VertexAttributeGeometry.FromGeometry(
		context,
		geometry,
	);
	console.log(vertexAttributeGeometry);

	let myBoxGeometry = boxGeometry(10, 2, 3, 5, 5, 5);
	console.log(myBoxGeometry);

	let boxVertexAttributeGeometry = VertexAttributeGeometry.FromGeometry(
		context,
		myBoxGeometry,
	);
	console.log(boxVertexAttributeGeometry);

	// source code definition of material
	let shaderCodeMaterial = new ShaderCodeMaterial(vs, fs);
	console.log(shaderCodeMaterial);

	let program = new Program(context, shaderCodeMaterial);
	console.log(program);

	// using uniform set structures
	class PBRMaterialUniforms {
		albedo: Color = new Color(1, 1, 1);
		roughness: number = 0.5;
		metalness: number = 0.0;
		emissive: Color = new Color(1, 1, 1);
		normalFactor: number = 1.0;
	}
	var pbrMaterialUniforms = new PBRMaterialUniforms();
	program.setUniformValues( pbrMaterialUniforms );


	// using uniform sets just from maps
	var unstructuredUniforms = {
		albedo: new Color(1, 1, 1),
		roughness: 0.5,
		metalness: 0.0,
		emissive: new Color(1, 1, 1),
		normalFactor: 1.0
	}
	program.setUniformValues( unstructuredUniforms );

	// bind to program
	let vertexArrayObject = new VertexArrayObject(
		program,
		vertexAttributeGeometry,
	);
	console.log(vertexArrayObject);

	let texture = new Texture(await fetchImage('./exocortex-logo.jpg'));

	console.log(texture);

	let textureImage2D = new TextureImage2D(context);
	textureImage2D.update(texture);
	console.log(textureImage2D);

	let node = new Node();
	console.log(node);

	let light = new PointLight();
	node.children.push(light);

	let mesh = new Mesh(myBoxGeometry);
	node.children.push(mesh);
}

test();
