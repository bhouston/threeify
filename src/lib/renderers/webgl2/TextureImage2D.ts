//
// OpenGL texture representation based on texImage2D function call
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
//
// Authors:
// * @bhouston
//

import { PixelFormat } from "../../textures/PixelFormat";
import { DataType } from "../../textures/DataType";
import { TextureTarget } from "./TextureTarget";
import { Context } from "./Context";

export class TextureImage2D {

    context: Context;
    target: TextureTarget;
    level: number;
    internalFormat: PixelFormat;
    width: number;
    height: number;
    pixelFormat: PixelFormat;
    dataType: DataType;
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
        generateMipmaps: boolean,
        pixelData: HTMLImageElement
    ) {

        this.context = context;
        this.target = target;
        this.level = level;
        this.internalFormat = internalFormat;
        this.width = width;
        this.height = height;
        this.pixelFormat = pixelFormat;
        this.dataType = dataType;
        this.generateMipmaps = generateMipmaps;
        this.pixelData = pixelData;

        let gl = this.context.gl;

        // Create a texture.
        {
            var glTexture = gl.createTexture();
            if (!glTexture) throw new Error("can not create texture");
            this.glTexture = glTexture;
        }

        gl.bindTexture(this.target, this.glTexture);
        gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.internalFormat, this.dataType, this.pixelData);

        if (this.generateMipmaps) {

            gl.generateMipmap(this.target);
            
        }

    }

}