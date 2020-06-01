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
import { IDisposable } from '../../interfaces/Standard.js';

export class TextureImage2D implements IDisposable {
	context: Context;
	target: TextureTarget;
	level: number;
	internalFormat: PixelFormat;
	width: number;
	height: number;
	pixelFormat: PixelFormat;
	dataType: DataType;
	wrapS: TextureWrap;
	wrapT: TextureWrap;
	magFilter: TextureFilter;
	minFilter: TextureFilter;
	generateMipmaps: boolean;
	glTexture: WebGLTexture;
	pixelData: HTMLImageElement;

	constructor(
		context: Context,
		target: TextureTarget,
		level: number,
		internalFormat: PixelFormat,
		width: number,
		height: number,
		pixelFormat: PixelFormat,
		dataType: DataType,
		wrapS: TextureWrap,
		wrapT: TextureWrap,
		magFilter: TextureFilter,
		minFilter: TextureFilter,
		generateMipmaps: boolean,
		pixelData: HTMLImageElement,
	) {
		this.context = context;
		this.target = target;
		this.level = level;
		this.internalFormat = internalFormat;
		this.width = width;
		this.height = height;
		this.pixelFormat = pixelFormat;
		this.dataType = dataType;
		this.wrapS = wrapS;
		this.wrapT = wrapT;
		this.magFilter = magFilter;
		this.minFilter = minFilter;
		this.generateMipmaps = generateMipmaps;
		this.pixelData = pixelData;

		let gl = this.context.gl;

		// Create a texture.
		{
			var glTexture = gl.createTexture();
			if (!glTexture) throw new Error('can not create texture');
			this.glTexture = glTexture;
		}

		gl.bindTexture(this.target, this.glTexture);
		gl.texImage2D(
			this.target,
			this.level,
			this.internalFormat,
			this.width,
			this.height,
			0,
			this.internalFormat,
			this.dataType,
			this.pixelData,
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
		this.context.gl.deleteTexture(this.glTexture);
	}

	static FromTexture(context: Context, texture: Texture) {
		if (!texture.image) throw new Error('texture.image is null');

		return new TextureImage2D(
			context,
			TextureTarget.Texture2D,
			0,
			texture.pixelFormat,
			texture.image.width,
			texture.image.height,
			texture.pixelFormat,
			texture.dataType,
			texture.wrapS,
			texture.wrapT,
			texture.magFilter,
			texture.minFilter,
			texture.generateMipmaps,
			texture.image,
		);
	}
}
