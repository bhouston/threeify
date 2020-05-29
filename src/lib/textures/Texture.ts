//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { TextureWrap } from "./TextureWrap.js";
import { TextureFilter } from "./TextureFilter.js";
import { PixelFormat } from "./PixelFormat.js";
import { DataType } from "./DataType.js";

export class Texture {

    name: string = "";
    image: HTMLImageElement | null;
    sWrap: TextureWrap;
    tWrap: TextureWrap;
    magFilter: TextureFilter;
    minFilter: TextureFilter;
    pixelFormat: PixelFormat;
    dataType: DataType;
    anisotropyLevels: number;

    constructor(
        image: HTMLImageElement | null = null,
        sWrap: TextureWrap = TextureWrap.ClampToEdge,
        tWrap: TextureWrap = TextureWrap.ClampToEdge,
        magFilter: TextureFilter = TextureFilter.Linear,
        minFilter: TextureFilter = TextureFilter.LinearMipmapLinear,
        pixelFormat: PixelFormat = PixelFormat.RGBA,
        dataType: DataType = DataType.UnsignedByte,
        anisotropyLevels: number = 1 ) {

        this.image = image;
        this.sWrap = sWrap;
        this.tWrap = tWrap;
        this.magFilter = magFilter;
        this.minFilter = minFilter;
        this.pixelFormat = pixelFormat;
        this.dataType = dataType;
        this.anisotropyLevels = anisotropyLevels;
    }

    copy( source: Texture ) {

        this.name = source.name;
        this.image = source.image;
        this.sWrap = source.sWrap;
        this.tWrap = source.tWrap;
        this.magFilter = source.magFilter;
        this.minFilter = source.minFilter;
        this.pixelFormat = source.pixelFormat;
        this.dataType = source.dataType;
        this.anisotropyLevels = source.anisotropyLevels;

    }

}