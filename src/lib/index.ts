import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';
import { Node } from './scenegraph/Node.js';
import { IndexedGeometry } from './geometry/IndexedGeometry.js';
import { Geometry } from './geometry/Geometry.js';
import { Shader, ShaderType } from './renderers/webgl2/Shader.js';
import { ShaderMaterial } from './renderers/common/ShaderMaterial.js';
import { Context } from './renderers/webgl2/Context.js';
import * as evs from './renderers/webgl2/shaders/mesh_fs.glsl';
import { Program } from './renderers/webgl2/Program.js';

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
in vec2 a_position;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

// all shaders have a main function
void main() {

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

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

var shaderMaterial = new ShaderMaterial( vs, fs );

var canvasElement = document.querySelector("#rendering-canvas") as HTMLCanvasElement;

var context = new Context( canvasElement );
var vertexShader = new Shader( context, vs, ShaderType.Vertex );
var fragmentShader = new Shader( context, fs, ShaderType.Fragment );
var program = new Program( context, vertexShader, fragmentShader );

console.log( program );