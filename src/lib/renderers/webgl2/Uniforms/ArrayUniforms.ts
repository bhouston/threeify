import { ComponentType } from '../../../core/ComponentType';
import { Matrix4 } from '../../../math/Matrix4';
import { ProgramUniform } from '../ProgramUniform';
import { Vector2 } from '../../../math/Vector2';
import { Vector3 } from '../../../math/Vector3';
import { Color } from '../../../math/Color';

const GL2 = WebGL2RenderingContext;

export enum UniformType {
    Bool = WebGL2RenderingContext.BOOL,
    BoolVec2 = WebGL2RenderingContext.BOOL_VEC2,
    BoolVec3 = WebGL2RenderingContext.BOOL_VEC3,
    BoolVec4 = WebGL2RenderingContext.BOOL_VEC4,

    Int = WebGL2RenderingContext.INT,
    IntVec2 = WebGL2RenderingContext.INT_VEC2,
    IntVec3 = WebGL2RenderingContext.INT_VEC3,
    IntVec4 = WebGL2RenderingContext.INT_VEC4,

    Float = WebGL2RenderingContext.FLOAT,
    FloatVec2 = WebGL2RenderingContext.FLOAT_VEC2,
    FloatVec3 = WebGL2RenderingContext.FLOAT_VEC3,
    FloatVec4 = WebGL2RenderingContext.FLOAT_VEC4,

    FloatMat2 = WebGL2RenderingContext.FLOAT_MAT2,
    FloatMat2x3 = WebGL2RenderingContext.FLOAT_MAT2x3,
    FloatMat2x4 = WebGL2RenderingContext.FLOAT_MAT2x4,

    FloatMat3x2 = WebGL2RenderingContext.FLOAT_MAT3x2,
    FloatMat3 = WebGL2RenderingContext.FLOAT_MAT3,
    FloatMat3x4 = WebGL2RenderingContext.FLOAT_MAT3x4,

    FloatMat4x2 = WebGL2RenderingContext.FLOAT_MAT4x3,
    FloatMat4x3 = WebGL2RenderingContext.FLOAT_MAT4x3,
    FloatMat4 = WebGL2RenderingContext.FLOAT_MAT4,
}


export interface IUniform {
    set( programUniform: ProgramUniform ): void;
}

// TODO: Figure out how to replace this with generics:
// e.g. class Uniform<T> implements IUniform { value: T = new T() }.  I can not get that to compile.

export class UniformFloat implements IUniform {
    value: number;

    constructor( value: number = 0.0 ) {
        this.value = value;
    }

    set( programUniform: ProgramUniform ) {
        let gl = programUniform.program.context.gl;
        gl.uniform1f( programUniform.glLocation, this.value );
    }
}

export class UniformVector2 implements IUniform {
    value: Vector2;

    constructor( value: Vector2 = new Vector2() ) {
        this.value = value;
    }

    set( programUniform: ProgramUniform ) {
        let gl = programUniform.program.context.gl;
        gl.uniform2f( programUniform.glLocation, this.value.x, this.value.y );
    }
}

export class UniformVector3 implements IUniform {
    value: Vector3;

    constructor( value: Vector3 = new Vector3() ) {
        this.value = value;
    }

    set( programUniform: ProgramUniform ) {
        let gl = programUniform.program.context.gl;
        gl.uniform3f( programUniform.glLocation, this.value.x, this.value.y, this.value.z );
    }
}

export class UniformColor implements IUniform {
    value: Color;

    constructor( value: Color = new Color() ) {
        this.value = value;
    }

    set( programUniform: ProgramUniform ) {
        let gl = programUniform.program.context.gl;
        gl.uniform3f( programUniform.glLocation, this.value.r, this.value.g, this.value.b );
    }
}

export class UniformMatrix4 implements IUniform {
    value: Matrix4;

    constructor( value: Matrix4 = new Matrix4() ) {
        this.value = value;
    }

    set( programUniform: ProgramUniform ) {
        let gl = programUniform.program.context.gl;
        gl.uniformMatrix4fv( programUniform.glLocation, false, this.value.elements ); return;
    }
}


export class PBRMaterialUniforms extends UniformSet {
    albedo: UniformColor = new UniformColor( new Color(1, 1, 1));
    roughness: UniformFloat = new UniformFloat( 0.5 );
    metalness: UniformFloat = new UniformFloat( 0.0 );
    emissive: UniformColor = new UniformColor( new Color(1, 1, 1));
    normalFactor: UniformFloat = new UniformFloat( 1.0 );

}

export class SceneUniforms extends UniformSet {
    worldToCameraMatrix: UniformMatrix4;
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
function setUniformValue(
	gl: WebGL2RenderingContext,
	location: WebGLUniformLocation,
	componentType: ComponentType,
	numComponents: number,
	arrayBuffer: Uint32Array | Int32Array | Float32Array,
) {
	switch (componentType) {
		case ComponentType.Float:
            switch( numComponents ) {
                case 1: gl.uniform1fv( location, arrayBuffer ); return;
                case 2: gl.uniform2fv( location, arrayBuffer ); return;
                case 3: gl.uniform3fv( location, arrayBuffer ); return;
                case 4: gl.uniform4fv( location, arrayBuffer ); return;
            }
            break;
		case ComponentType.Int:
            switch( numComponents ) {
                case 1: gl.uniform1iv( location, arrayBuffer ); return;
                case 2: gl.uniform2iv( location, arrayBuffer ); return;
                case 3: gl.uniform3iv( location, arrayBuffer ); return;
                case 4: gl.uniform4iv( location, arrayBuffer ); return;
            }
			break;
		case ComponentType.UnsignedInt:
            switch( numComponents ) {
                case 1: gl.uniform1uiv( location, arrayBuffer ); return;
                case 2: gl.uniform2uiv( location, arrayBuffer ); return;
                case 3: gl.uniform3uiv( location, arrayBuffer ); return;
                case 4: gl.uniform4uiv( location, arrayBuffer ); return;
            }
			break;
	}
    throw new Error('unsupported');
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix
function setUniformMatrixValue(
	gl: WebGL2RenderingContext,
	location: WebGLUniformLocation,
    matrixWidth: number,
    matrixHeight: number,
	arrayBuffer: Float32Array,
) {
	switch (matrixWidth) {
		case 2:
            switch( matrixHeight ) {
                case 2: gl.uniformMatrix2fv( location, false, arrayBuffer ); return;
                case 3: gl.uniformMatrix2x3fv( location, false, arrayBuffer ); return;
                case 4: gl.uniformMatrix2x4fv( location, false, arrayBuffer ); return;
            }
            break;
		case 3:
            switch( matrixHeight ) {
                case 2: gl.uniformMatrix3x2fv( location, false, arrayBuffer ); return;
                case 3: gl.uniformMatrix3fv( location, false, arrayBuffer ); return;
                case 4: gl.uniformMatrix3x4fv( location, false, arrayBuffer ); return;
            }
            break;
		case 4:
            switch( matrixHeight ) {
                case 2: gl.uniformMatrix4x2fv( location, false, arrayBuffer ); return;
                case 3: gl.uniformMatrix4x3fv( location, false, arrayBuffer ); return;
                case 4: gl.uniformMatrix4fv( location, false, arrayBuffer ); return;
            }
			break;
	}	
    throw new Error('unsupported');
}

// Array of matrices (flat or from THREE clases)

function setValueM2Array(gl, v) {
	var data = flatten(v, this.size, 4);

	gl.uniformMatrix2fv(this.addr, false, data);
}

function setValueM3Array(gl, v) {
	var data = flatten(v, this.size, 9);

	gl.uniformMatrix3fv(this.addr, false, data);
}

function setValueM4Array(gl, v) {
	var data = flatten(v, this.size, 16);

	gl.uniformMatrix4fv(this.addr, false, data);
}

// Array of textures (2D / Cube)

function setValueT1Array(gl, v, textures) {
	var n = v.length;

	var units = allocTexUnits(textures, n);

	gl.uniform1iv(this.addr, units);

	for (var i = 0; i !== n; ++i) {
		textures.safeSetTexture2D(v[i] || emptyTexture, units[i]);
	}
}

function setValueT6Array(gl, v, textures) {
	var n = v.length;

	var units = allocTexUnits(textures, n);

	gl.uniform1iv(this.addr, units);

	for (var i = 0; i !== n; ++i) {
		textures.safeSetTextureCube(v[i] || emptyCubeTexture, units[i]);
	}
}

// Helper to pick the right setter for a pure (bottom-level) array

function getPureArraySetter(type) {
	switch (type) {
		case 0x1406:
			return setValueV1fArray; // FLOAT
		case 0x8b50:
			return setValueV2fArray; // _VEC2
		case 0x8b51:
			return setValueV3fArray; // _VEC3
		case 0x8b52:
			return setValueV4fArray; // _VEC4

		case 0x8b5a:
			return setValueM2Array; // _MAT2
		case 0x8b5b:
			return setValueM3Array; // _MAT3
		case 0x8b5c:
			return setValueM4Array; // _MAT4

		case 0x1404:
		case 0x8b56:
			return setValueV1iArray; // INT, BOOL
		case 0x8b53:
		case 0x8b57:
			return setValueV2iArray; // _VEC2
		case 0x8b54:
		case 0x8b58:
			return setValueV3iArray; // _VEC3
		case 0x8b55:
		case 0x8b59:
			return setValueV4iArray; // _VEC4

		case 0x8b5e: // SAMPLER_2D
		case 0x8d66: // SAMPLER_EXTERNAL_OES
		case 0x8dca: // INT_SAMPLER_2D
		case 0x8dd2: // UNSIGNED_INT_SAMPLER_2D
		case 0x8b62: // SAMPLER_2D_SHADOW
			return setValueT1Array;

		case 0x8b60: // SAMPLER_CUBE
		case 0x8dcc: // INT_SAMPLER_CUBE
		case 0x8dd4: // UNSIGNED_INT_SAMPLER_CUBE
		case 0x8dc5: // SAMPLER_CUBE_SHADOW
			return setValueT6Array;
	}
}
