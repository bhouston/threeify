//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { generateUUID } from "../model/generateUuid.js";
import {
  IDisposable,
  IIdentifiable,
  IVersionable,
} from "../model/interfaces.js";
import { Vector2 } from "../math/Vector2.js";
import { IPoolUser } from "../renderers/Pool.js";
import { DataType } from "./DataType.js";
import { PixelFormat } from "./PixelFormat.js";
import { TextureFilter } from "./TextureFilter.js";
import { TextureWrap } from "./TextureWrap.js";

export class ArrayBufferImage {
	data: ArrayBuffer;
	width:number;
	height:number;

	constructor( data: ArrayBuffer, width: number, height: number ){
		this.data=data;
		this.width=width;
		this.height=height;
	}

}

/*
void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
void gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLCanvasElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, ImageBitmap? pixels);
*/

export class Texture
  implements IIdentifiable, IVersionable, IDisposable, IPoolUser {
  disposed: boolean = false;
  uuid: string = generateUUID();
  version: number = 0;
  name: string = "";
  image: ArrayBufferImage | HTMLImageElement;
  size: Vector2 = new Vector2();
  wrapS: TextureWrap;
  wrapT: TextureWrap;
  magFilter: TextureFilter;
  minFilter: TextureFilter;
  pixelFormat: PixelFormat;
  dataType: DataType;
  generateMipmaps: boolean;
  anisotropyLevels: number;

  constructor(
    image: ArrayBufferImage | HTMLImageElement,
    wrapS: TextureWrap = TextureWrap.ClampToEdge,
    wrapT: TextureWrap = TextureWrap.ClampToEdge,
    magFilter: TextureFilter = TextureFilter.Linear,
    minFilter: TextureFilter = TextureFilter.LinearMipmapLinear,
    pixelFormat: PixelFormat = PixelFormat.RGBA,
    dataType: DataType = DataType.UnsignedByte,
    generateMipmaps: boolean = true,
    anisotropyLevels: number = 1
  ) {
    this.image = image;
	this.size = new Vector2(image.width, image.height);
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
