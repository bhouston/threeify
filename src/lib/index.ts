import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';
import { Node } from './objects/Node.js';
import { AttributeGeometry } from './core/AttributeGeometry.js';
import { Shader, ShaderType } from './renderers/webgl2/Shader.js';
import { ShaderMaterial } from './renderers/common/ShaderMaterial.js';
import { Context } from './renderers/webgl2/Context.js';
import * as evs from './renderers/webgl2/shaders/mesh_fs.glsl';
import { Program } from './renderers/webgl2/Program.js';
import { Buffer } from './renderers/webgl2/Buffer.js';
import { BufferAccessor } from './renderers/webgl2/BufferAccessor.js';
import { BufferGeometry } from './renderers/webgl2/BufferGeometry.js';
import { AttributeArray } from './core/AttributeArray.js';
import { AttributeView } from './core/AttributeView.js';
import { AttributeAccessor } from './core/AttributeAccessor.js';
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

var indexAttributeArray = new AttributeArray( new Int16Array( [
  0, 1, 2, 0, 2, 3
] ) );
var indexAttributeView = new AttributeView( indexAttributeArray, 0, -1, 2 );
var indexAccessor = new AttributeAccessor( indexAttributeView, 0, ComponentType.UnsignedShort, 1, -1 );

var positionAttributeArray = new AttributeArray( new Float32Array( [
  0.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
] ) );
var positionAttributeView = new AttributeView( positionAttributeArray, 0, -1, 12 );
var positionAccessor = new AttributeAccessor( positionAttributeView, 0, ComponentType.Float, 3, -1 );

var normalAttributeArray = new AttributeArray( new Float32Array( [
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
] ) );
var normalAttributeView = new AttributeView( normalAttributeArray, 0, -1, 12 );
var normalAccessor = new AttributeAccessor( normalAttributeView, 0, ComponentType.Float, 3, -1 );

var uvAttributeArray = new AttributeArray( new Float32Array( [
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
] ) );
var uvAttributeView = new AttributeView( uvAttributeArray, 0, -1, 8 );
var uvAccessor = new AttributeAccessor( uvAttributeView, 0, ComponentType.Float, 2, -1 );

var attributeGeometry = new AttributeGeometry( indexAccessor, positionAccessor, normalAccessor, uvAccessor );
console.log( attributeGeometry );

// setup webgl2
var canvasElement = document.querySelector("#rendering-canvas") as HTMLCanvasElement;
var context = new Context( canvasElement );


// upload to GPU

function toBufferAccessor( context: Context, attributeAccessor: AttributeAccessor ) {
  let attributeView = attributeAccessor.attributeView;
  let attributeArray = attributeView.attributeArray;

  let buffer = new Buffer( context, attributeArray.arrayBuffer, attributeView.target );
  let bufferAccessor = new BufferAccessor( buffer, attributeAccessor.componentType, attributeAccessor.componentsPerVertex, false, attributeView.byteStride, attributeView.byteOffset + attributeAccessor.byteOffset );

  return bufferAccessor;
}

var bufferGeometry = new BufferGeometry(
  toBufferAccessor( context, indexAccessor ),
  toBufferAccessor( context, positionAccessor ),
  toBufferAccessor( context, normalAccessor ),
  toBufferAccessor( context, uvAccessor ) );

  console.log( bufferGeometry );


// source code definition of material
var shaderMaterial = new ShaderMaterial( vs, fs );

console.log( shaderMaterial );

// load material into gpu

var vertexShader = new Shader( context, vs, ShaderType.Vertex );
var fragmentShader = new Shader( context, fs, ShaderType.Fragment );
var program = new Program( context, vertexShader, fragmentShader );

console.log( program );

// bind to program
var vertexArrayObject = new VertexArrayObject( program, bufferGeometry );

console.log( vertexArrayObject );