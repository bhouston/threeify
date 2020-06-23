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
import { Texture, TextureImage } from "../../../textures/Texture";
import { Pool } from "../../Pool";
import { GL } from "../GL";
import { RenderingContext } from "../RenderingContext";
import { DataType } from "./DataType";
import { PixelFormat } from "./PixelFormat";
import { TexParameters } from "./TexParameters";
import { TextureTarget } from "./TextureTarget";

export class TexImage2D implements IDisposable {
  disposed = false;
  target: TextureTarget;
  glTexture: WebGLTexture;
  dataType: DataType;
  pixelFormat: PixelFormat;
  size: Vector2;

  constructor(
    public context: RenderingContext,
    public texture: Texture | CubeTexture,
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

    if (texture instanceof Texture) {
      this.target = TextureTarget.Texture2D;
    } else if (texture instanceof CubeTexture) {
      this.target = TextureTarget.TextureCubeMap;
    } else {
      throw new Error("Unsupported target");
    }

    gl.bindTexture(this.target, this.glTexture);
    if (texture instanceof Texture) {
      this.loadImage(texture.image);
    } else if (texture instanceof CubeTexture) {
      texture.images.forEach((image: TextureImage, index: number) => {
        this.loadImage(image, TextureTarget.CubeMapPositiveX + index);
      });
    }

    if (texParameters.generateMipmaps) {
      gl.generateMipmap(this.target);
    }

    gl.texParameteri(this.target, GL.TEXTURE_WRAP_S, texParameters.wrapS);
    gl.texParameteri(this.target, GL.TEXTURE_WRAP_T, texParameters.wrapS);

    gl.texParameteri(this.target, GL.TEXTURE_MAG_FILTER, texParameters.magFilter);
    gl.texParameteri(this.target, GL.TEXTURE_MIN_FILTER, texParameters.minFilter);

    gl.bindTexture(this.target, null);

    // gl.texParameteri(this.target, gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT, texParameters.anisotropicLevels);
  }

  private loadImage(image: TextureImage, target: TextureTarget | undefined = undefined): void {
    const gl = this.context.gl;
    if (image instanceof ArrayBufferImage) {
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
        0,
      );
    } else if (image instanceof HTMLImageElement) {
      gl.texImage2D(
        target ?? this.target,
        this.level,
        this.internalFormat,
        this.size.width,
        this.size.height,
        0,
        this.pixelFormat,
        this.dataType,
        image,
      );
    } else {
      throw new Error("unsupported image type");
    }
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
