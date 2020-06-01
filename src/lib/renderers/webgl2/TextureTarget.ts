//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

const GL = WebGLRenderingContext;

// from https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
export enum TextureTarget {
	Texture2D = GL.TEXTURE_2D, //  A two-dimensional texture.
	CubeMapPositiveX = GL.TEXTURE_CUBE_MAP_POSITIVE_X, // Cube map sides...
	CubeMapNegativeX = GL.TEXTURE_CUBE_MAP_NEGATIVE_X,
	CubeMapPositiveY = GL.TEXTURE_CUBE_MAP_POSITIVE_Y,
	CubeMapNegativeY = GL.TEXTURE_CUBE_MAP_NEGATIVE_Y,
	CubeMapPositiveZ = GL.TEXTURE_CUBE_MAP_POSITIVE_Z,
	CubeMapNegativeZ = GL.TEXTURE_CUBE_MAP_NEGATIVE_Z,
}
