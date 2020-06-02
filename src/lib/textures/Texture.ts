//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../generateUuid.js';
import {
	IDisposable,
	IIdentifiable,
	IVersionable,
} from '../interfaces/Standard.js';
import { Vector2 } from '../math/Vector2.js';
import { IPoolUser } from '../renderers/Pool.js';
import { DataType } from './DataType.js';
import { PixelFormat } from './PixelFormat.js';
import { TextureFilter } from './TextureFilter.js';
import { TextureWrap } from './TextureWrap.js';

export class Texture
	implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
	disposed: boolean = false;
	uuid: string = generateUUID();
	version: number = 0;
	name: string = '';
	size: Vector2 = new Vector2();
	image: HTMLImageElement | null;
	wrapS: TextureWrap;
	wrapT: TextureWrap;
	magFilter: TextureFilter;
	minFilter: TextureFilter;
	pixelFormat: PixelFormat;
	dataType: DataType;
	generateMipmaps: boolean;
	anisotropyLevels: number;

	constructor(
		image: HTMLImageElement | null = null,
		wrapS: TextureWrap = TextureWrap.ClampToEdge,
		wrapT: TextureWrap = TextureWrap.ClampToEdge,
		magFilter: TextureFilter = TextureFilter.Linear,
		minFilter: TextureFilter = TextureFilter.LinearMipmapLinear,
		pixelFormat: PixelFormat = PixelFormat.RGBA,
		dataType: DataType = DataType.UnsignedByte,
		generateMipmaps: boolean = true,
		anisotropyLevels: number = 1,
	) {
		this.image = image;
		if (image) {
			this.size = new Vector2(image.width, image.height);
		}
		this.wrapS = wrapS;
		this.wrapT = wrapT;
		this.magFilter = magFilter;
		this.minFilter = minFilter;
		this.pixelFormat = pixelFormat;
		this.dataType = dataType;
		this.generateMipmaps = generateMipmaps;
		this.anisotropyLevels = anisotropyLevels;
	}

	copy(source: Texture) {
		this.name = source.name;
		this.image = source.image;
		this.wrapS = source.wrapS;
		this.wrapT = source.wrapT;
		this.magFilter = source.magFilter;
		this.minFilter = source.minFilter;
		this.pixelFormat = source.pixelFormat;
		this.dataType = source.dataType;
		this.anisotropyLevels = source.anisotropyLevels;
	}

	dirty() {
		this.version++;
	}

	dispose() {
		if (!this.disposed) {
			this.disposed = true;
			this.dirty();
		}
	}
}
