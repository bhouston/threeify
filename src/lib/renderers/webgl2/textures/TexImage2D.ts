//
// OpenGL texture representation based on texImage2D function call
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
//
// Authors:
// * @bhouston
//

import { Vector2 } from "lib/math/Vector2";
import { IDisposable } from "../../../core/types";
import { ArrayBufferImage, Texture } from "../../../textures/Texture";
import { Pool } from "../../Pool";
import { RenderingContext } from "../RenderingContext";
import { DataType } from "./DataType";
import { PixelFormat } from "./PixelFormat";
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
  glTexture: WebGLTexture;
  dataType: DataType;
  pixelFormat: PixelFormat;
  size: Vector2;

  constructor(
    public context: RenderingContext,
    public texture: Texture,
    public target: TextureTarget = TextureTarget.Texture2D,
    public level = 0,
    public internalFormat: PixelFormat = PixelFormat.RGBA,
    public texParameters: TexParameters = new TexParameters(),
  ) {
    const gl = this.context.gl;

    // Create a texture.
    {
      const glTexture = gl.createTexture();
      if (glTexture === null) {
        throw new Error("createTexture failed");
      }
      this.glTexture = glTexture;
    }

    this.dataType = texture.dataType;
    this.pixelFormat = texture.pixelFormat;
    this.size = texture.size;

    gl.bindTexture(this.target, this.glTexture);
    if (texture.image instanceof ArrayBufferImage) {
      gl.texImage2D(
        this.target,
        this.level,
        this.internalFormat,
        this.size.width,
        this.size.height,
        0,
        this.pixelFormat,
        this.dataType,
        new Uint8Array(texture.image.data),
        0,
      );
    } else if (texture.image instanceof HTMLImageElement) {
      gl.texImage2D(
        this.target,
        this.level,
        this.internalFormat,
        this.size.width,
        this.size.height,
        0,
        this.pixelFormat,
        this.dataType,
        texture.image,
      );
    }

    if (texParameters.generateMipmaps) {
      gl.generateMipmap(this.target);
    }

    gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, texParameters.wrapS);
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, texParameters.wrapS);

    gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, texParameters.magFilter);
    gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, texParameters.minFilter);

    gl.bindTexture(this.target, null);

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
    super(context, (context: RenderingContext, texture: Texture, texImage2D: TexImage2D | undefined) => {
      if (texImage2D === undefined) {
        texImage2D = new TexImage2D(context, texture);
      }
      // TODO: Create a new image here.
      // texImage2D.update(texture);
      return texImage2D;
    });
  }
}
