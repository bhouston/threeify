//
// OpenGL texture representation based on texImage2D function call
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
//
// Authors:
// * @bhouston
//

import { PixelFormat } from '../../textures/PixelFormat.js';
import { DataType } from '../../textures/DataType.js';
import { TextureTarget } from './TextureTarget.js';
import { Context } from './Context.js';
import { Texture } from '../../textures/Texture.js';
import { TextureWrap } from '../../textures/TextureWrap.js';
import { TextureFilter } from '../../textures/TextureFilter.js';
import { IDisposable } from '../../model/interfaces.js';
import { Pool } from '../Pool.js';
import { Box2 } from '../../math/Box2.js';
import { Vector2 } from '../../math/Vector2.js';

const GL = WebGLRenderingContext;

export enum TextureSourceType {
	ArrayBufferView,
	ImageDate,
	HTMLImageElement,
	HTMLCanvasElement,
	HTMLVideoElement,
	ImageBitmap,
}

export class TexImage2D implements IDisposable {
	disposed: boolean = false;
	context: Context;
	glTexture: WebGLTexture;
	target: TextureTarget = TextureTarget.Texture2D;
	level: number = 0;
	internalFormat: PixelFormat = PixelFormat.RGBA;
	size: Vector2 = new Vector2();
	pixelFormat: PixelFormat = PixelFormat.RGBA;
	dataType: DataType = DataType.UnsignedByte;
	wrapS: TextureWrap = TextureWrap.Repeat;
	wrapT: TextureWrap = TextureWrap.Repeat;
	magFilter: TextureFilter = TextureFilter.Linear;
	minFilter: TextureFilter = TextureFilter.LinearMipmapLinear;
	generateMipmaps: boolean = true;

	constructor(context: Context) {
		this.context = context;

		let gl = this.context.gl;

		// Create a texture.
		{
			let glTexture = gl.createTexture();
			if (!glTexture) throw new Error('createTexture failed');
			this.glTexture = glTexture;
		}
	}
	/*level: number = 0;
	internalFormat: PixelFormat = PixelFormat.RGBA
	width: number = 0;
	height: number = 0;
	pixelFormat: PixelFormat = PixelFormat.RGBA;
	dataType: DataType = DataType.UnsignedByte;
	wrapS: TextureWrap = TextureWrap.Repeat;
	wrapT: TextureWrap = TextureWrap.Repeat;
	magFilter: TextureFilter = TextureFilter.Linear;
	minFilter: TextureFilter = TextureFilter.LinearMipmapLinear;
	generateMipmaps: boolean = true;*/

	update(texture: Texture): void {
		if (!texture.image) throw new Error('texture.image is null');

		this.target = TextureTarget.Texture2D;
		this.level = 0;
		this.internalFormat = texture.pixelFormat;
		this.size = texture.size;
		this.pixelFormat = texture.pixelFormat;
		this.dataType = texture.dataType;
		this.wrapS = texture.wrapS;
		this.wrapT = texture.wrapT;
		this.magFilter = texture.magFilter;
		this.minFilter = texture.minFilter;
		this.generateMipmaps = texture.generateMipmaps;

		let gl = this.context.gl;

		gl.bindTexture(this.target, this.glTexture);
		gl.texImage2D(
			this.target,
			this.level,
			this.internalFormat,
			this.size.width,
			this.size.height,
			0,
			this.internalFormat,
			this.dataType,
			texture.image,
		);

		if (this.generateMipmaps) {
			gl.generateMipmap(this.target);
		}

		gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
		gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapS);

		gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
		gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
	}

	dispose() {
		if (!this.disposed) {
			this.context.gl.deleteTexture(this.glTexture);
			this.disposed = true;
		}
	}
}

export class TexImage2DPool extends Pool<Texture, TexImage2D> {
	constructor(context: Context) {
		super(
			context,
			(context: Context, texture: Texture, texImage2D: TexImage2D | null) => {
				if (!texImage2D) {
					texImage2D = new TexImage2D(context);
				}
				texImage2D.update(texture);
				return texImage2D;
			},
		);
	}
}
