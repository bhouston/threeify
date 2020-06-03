//
// OpenGL-compatible depth test state
//
// Authors:
// * @bhouston
//

const GL = WebGLRenderingContext;

export enum DepthTestFunc {
	Never = GL.NEVER, // never pass
	Less = GL.LESS, // pass if the incoming value is less than the depth buffer value
	Equal = GL.EQUAL, // pass if the incoming value equals the the depth buffer value
	LessOrEqual = GL.LEQUAL, // pass if the incoming value is less than or equal to the depth buffer value
	Greater = GL.GREATER, // pass if the incoming value is greater than the depth buffer value
	NotEqual = GL.NOTEQUAL, // pass if the incoming value is not equal to the depth buffer value
	GreaterOrEqual = GL.GEQUAL, //pass if the incoming value is greater than or equal to the depth buffer value
	Always = GL.ALWAYS, //always pass
}

export class DepthTestState {
	enabled: boolean = true;
	func: DepthTestFunc = DepthTestFunc.Less;
}
