//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { TextureWrap } from './TextureWrap.js';
import { TextureFilter } from './TextureFilter.js';
import { PixelFormat } from './PixelFormat.js';
import { DataType } from './DataType.js';
import {
	IVersionable,
	IDisposable,
	IIdentifiable,
} from '../interfaces/Standard.js';
import { generateUUID } from '../generateUuid.js';

export class Texture implements IIdentifiable, IVersionable, IDisposable {
	disposed: boolean = false;
	uuid: string = generateUUID();
	version: number = 0;
	name: string = '';
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
		if( ! this.disposed ) {
			this.disposed = true;
			this.dirty();
		}
	}
}
