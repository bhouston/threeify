import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';
import { Node } from './nodes/Node.js';
import { Geometry } from './core/Geometry.js';
import { BoxGeometry, BoxParameters } from './geometry/BoxGeometry.js';
import { Shader, ShaderType } from './renderers/webgl2/Shader.js';
import { ShaderMaterial } from './renderers/common/ShaderMaterial.js';
import { Context } from './renderers/webgl2/Context.js';
import * as evs from './renderers/webgl2/shaders/mesh_fs.glsl';
import { Program } from './renderers/webgl2/Program.js';
import { Buffer } from './renderers/webgl2/Buffer.js';
import { VertexAttribute } from './renderers/webgl2/VertexAttribute.js';
import { VertexAttributeGeometry } from './renderers/webgl2/VertexAttributeGeometry.js';
import { AttributeView } from './core/AttributeView.js';
import { AttributeAccessor, Int32AttributeAccessor, Float32AttributeAccessor, Int16AttributeAccessor } from './core/AttributeAccessor.js';
import { ComponentType } from './core/ComponentType.js';
import { VertexArrayObject } from './renderers/webgl2/VertexArrayObject.js';

let a = new Vector3( 1, 0, 0 );
let b = new Vector3( 3, 2, 3 );
//let e = new Vector3( 3, 'ben', 3 ); // a type bug, uncomment to see how it is caught automatically.

let m = new Matrix4().set( 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 0 );
 
console.log( a );
a.applyMatrix4( m );
console.log( a );
let c = a.add( b ).dot( b );
console.log( c );


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
`

var fs = `#version 300 es

precision highp float;

uniform vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = u_color;
}
`

// main memory representation setup

var indexAccessor = new Int16AttributeAccessor( new Int16Array( [
  0, 1, 2, 0, 2, 3
] ), 1 )

var positionAccessor = new Float32AttributeAccessor( new Float32Array( [
  0.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
] ), 3 );

var normalAccessor = new Float32AttributeAccessor( new Float32Array( [
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
] ), 3 );

var uvAccessor = new Float32AttributeAccessor( new Float32Array( [
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
] ), 2 );

var geometry = new Geometry();
geometry.setIndices( indexAccessor );
geometry.setAttribute( 'position', positionAccessor );
geometry.setAttribute( 'normal', normalAccessor );
geometry.setAttribute( 'uv', uvAccessor );

console.log( geometry );

// setup webgl2
var canvasElement = document.querySelector("#rendering-canvas") as HTMLCanvasElement;
var context = new Context( canvasElement );


// upload to GPU

let vertexAttributeGeometry = VertexAttributeGeometry.FromGeometry( context, geometry );

console.log( vertexAttributeGeometry );

// source code definition of material
var shaderMaterial = new ShaderMaterial( vs, fs );

console.log( shaderMaterial );

// load material into gpu

var vertexShader = new Shader( context, vs, ShaderType.Vertex );
var fragmentShader = new Shader( context, fs, ShaderType.Fragment );
var program = new Program( context, vertexShader, fragmentShader );

console.log( program );

// bind to program
var vertexArrayObject = new VertexArrayObject( program, vertexAttributeGeometry );

console.log( vertexArrayObject );

var boxGeometry = new BoxGeometry( new BoxParameters( 10, 2, 3, 5, 5, 5 ) );

console.log( boxGeometry );

let boxVertexAttributeGeometry = VertexAttributeGeometry.FromGeometry( context, boxGeometry );

console.log( boxVertexAttributeGeometry );