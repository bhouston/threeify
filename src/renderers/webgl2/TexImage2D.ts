//
// OpenGL texture representation based on texImage2D function call
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../core/types";
import { Vector2 } from "../../math/Vector2";
import { DataType } from "../../textures/DataType";
import { PixelFormat } from "../../textures/PixelFormat";
import { ArrayBufferImage, Texture } from "../../textures/Texture";
import { Pool } from "../Pool";
import { RenderingContext } from "./RenderingContext";
import { TexParameters } from "./TexParameters";

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

export enum TextureSourceType {
  ArrayBufferView,
  ImageDate,
  HTMLImageElement,
  HTMLCanvasElement,
  HTMLVideoElement,
  ImageBitmap,
}

export class TexImage2D implements IDisposable {
  disposed = false;
  context: RenderingContext;
  glTexture: WebGLTexture;
  image: ArrayBufferImage | HTMLImageElement;
  target: TextureTarget;
  level: number;
  internalFormat: PixelFormat;
  size: Vector2;
  pixelFormat: PixelFormat;
  dataType: DataType;
  texParameters: TexParameters;

  constructor(
    context: RenderingContext,
    image: ArrayBufferImage | HTMLImageElement,
    target: TextureTarget = TextureTarget.Texture2D,
    level = 0,
    internalFormat: PixelFormat = PixelFormat.RGBA,
    size: Vector2 = new Vector2(0, 0),
    pixelFormat: PixelFormat = PixelFormat.RGBA,
    dataType: DataType = DataType.UnsignedByte,
    texParameters: TexParameters = new TexParameters(),
  ) {
    this.context = context;
    this.image = image;
    this.target = target;
    this.level = level;
    this.internalFormat = internalFormat;
    this.size = size;
    this.pixelFormat = pixelFormat;
    this.dataType = dataType;
    this.texParameters = texParameters;

    const gl = this.context.gl;

    // Create a texture.
    {
      const glTexture = gl.createTexture();
      if (!glTexture) {
        throw new Error("createTexture failed");
      }
      this.glTexture = glTexture;
    }

    gl.bindTexture(this.target, this.glTexture);
    if (this.image instanceof ArrayBufferImage) {
      gl.texImage2D(
        this.target,
        this.level,
        this.internalFormat,
        this.size.width,
        this.size.height,
        0,
        this.internalFormat,
        this.dataType,
        new Uint8Array(this.image.data),
        0,
      );
    } else if (this.image instanceof HTMLImageElement) {
      gl.texImage2D(
        this.target,
        this.level,
        this.internalFormat,
        this.size.width,
        this.size.height,
        0,
        this.internalFormat,
        this.dataType,
        this.image,
      );
    }

    if (texParameters.generateMipmaps) {
      gl.generateMipmap(this.target);
    }

    gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, texParameters.wrapS);
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, texParameters.wrapS);

    gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, texParameters.magFilter);
    gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, texParameters.minFilter);

    // gl.texParameteri(this.target, gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT, texParameters.anisotropicLevels);
  }

  dispose(): void {
    if (!this.disposed) {
      this.context.gl.deleteTexture(this.glTexture);
      this.disposed = true;
    }
  }
}

export class TexImage2DPool extends Pool<Texture, TexImage2D> {
  constructor(context: RenderingContext) {
    super(context, (context: RenderingContext, texture: Texture, texImage2D: TexImage2D | null) => {
      if (!texImage2D) {
        texImage2D = new TexImage2D(context, texture.image);
      }
      // TODO: Create a new image here.
      // texImage2D.update(texture);
      return texImage2D;
    });
  }
}
