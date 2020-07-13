//
// OpenGL texture representation based on texImage2D function call
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../../core/types";
import { Vector2 } from "../../../math/Vector2";
import { ArrayBufferImage } from "../../../textures/ArrayBufferImage";
import { CubeTexture } from "../../../textures/CubeTexture";
import { Texture, TextureSource } from "../../../textures/Texture";
import { Pool } from "../../Pool";
import { GL } from "../GL";
import { RenderingContext } from "../RenderingContext";
import { DataType } from "./DataType";
import { PixelFormat } from "./PixelFormat";
import { TexParameters } from "./TexParameters";
import { TextureTarget } from "./TextureTarget";

export class TexImage2D implements IDisposable {
  disposed = false;
  glTexture: WebGLTexture;

  constructor(
    public context: RenderingContext,
    public images: TextureSource[],
    public size: Vector2,
    public level = 0,
    public internalFormat = PixelFormat.RGBA,
    public dataType = DataType.UnsignedByte,
    public pixelFormat = PixelFormat.RGBA,
    public target = TextureTarget.Texture2D,
    public texParameters = new TexParameters(),
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

    this.loadImages(images);

    gl.texParameteri(this.target, GL.TEXTURE_WRAP_S, texParameters.wrapS);
    gl.texParameteri(this.target, GL.TEXTURE_WRAP_T, texParameters.wrapS);

    gl.texParameteri(this.target, GL.TEXTURE_MAG_FILTER, texParameters.magFilter);
    gl.texParameteri(this.target, GL.TEXTURE_MIN_FILTER, texParameters.minFilter);

    if (texParameters.anisotropyLevels > 1) {
      const tfa = this.context.glxo.EXT_texture_filter_anisotropic;
      if (tfa !== null) {
        // TODO: Cache this at some point for speed improvements
        const maxAllowableAnisotropy = gl.getParameter(tfa.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        gl.texParameterf(
          this.target,
          tfa.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(texParameters.anisotropyLevels, maxAllowableAnisotropy),
        );
      }
    }

    if (texParameters.generateMipmaps) {
      gl.generateMipmap(this.target);
    }

    gl.bindTexture(this.target, null);
  }

  dispose(): void {
    if (!this.disposed) {
      this.context.gl.deleteTexture(this.glTexture);
      this.disposed = true;
    }
  }

  public loadImages(images: TextureSource[]): void {
    const gl = this.context.gl;
    gl.bindTexture(this.target, this.glTexture);
    if (images.length === 0) {
      this.loadImage(null);
    } else if (images.length === 1) {
      this.loadImage(images[0]);
    } else if (images.length === 6) {
      images.forEach((image: TextureSource, index: number) => {
        this.loadImage(image, TextureTarget.CubeMapPositiveX + index);
      });
    } else {
      throw new Error("Unsupported number of images");
    }
  }

  private loadImage(image: TextureSource | null, target: TextureTarget | undefined = undefined): void {
    const gl = this.context.gl;
    if (image === null) {
      gl.texImage2D(
        target ?? this.target,
        this.level,
        this.internalFormat,
        this.size.width,
        this.size.height,
        0,
        this.pixelFormat,
        this.dataType,
        null,
      );
    } else if (image instanceof ArrayBufferImage) {
      gl.texImage2D(
        target ?? this.target,
        this.level,
        this.internalFormat,
        this.size.width,
        this.size.height,
        0,
        this.pixelFormat,
        this.dataType,
        new Uint8Array(image.data),
      );
    } else if (image instanceof HTMLCanvasElement || image instanceof OffscreenCanvas) {
      gl.texImage2D(target ?? this.target, this.level, this.internalFormat, this.pixelFormat, this.dataType, image);
    } else {
      throw new Error("unsupported image type");
    }
  }
}

export function makeTexImage2DFromTexture(
  context: RenderingContext,
  texture: Texture,
  level = 0,
  internalFormat: PixelFormat = PixelFormat.RGBA,
): TexImage2D {
  return new TexImage2D(
    context,
    [texture.image],
    texture.size,
    level,
    texture.pixelFormat,
    texture.dataType,
    internalFormat,
    TextureTarget.Texture2D,
  );
}

export function makeTexImage2DFromCubeTexture(
  context: RenderingContext,
  texture: CubeTexture,
  level = 0,
  internalFormat: PixelFormat = PixelFormat.RGBA,
): TexImage2D {
  return new TexImage2D(
    context,
    texture.images,
    texture.size,
    level,
    texture.pixelFormat,
    texture.dataType,
    internalFormat,
    TextureTarget.TextureCubeMap,
  );
}

export class TexImage2DPool extends Pool<Texture, TexImage2D> {
  constructor(context: RenderingContext) {
    super(context, (context: RenderingContext, texture: Texture, texImage2D: TexImage2D | undefined) => {
      if (texImage2D === undefined) {
        texImage2D = makeTexImage2DFromTexture(context, texture);
      }
      // TODO: Create a new image here.
      // texImage2D.update(texture);
      return texImage2D;
    });
  }
}
