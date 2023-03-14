//
// OpenGL texture representation based on texImage2D function call
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
//
// Authors:
// * @bhouston
//

import { Vec2 } from '@threeify/math';

import { generateUUID } from '../../../core/generateUuid.js';
import { ArrayImage } from '../../../textures/ArrayBufferImage.js';
import { CubeMapTexture } from '../../../textures/CubeMapTexture.js';
import { Texture } from '../../../textures/Texture.js';
import { TextureSource } from '../../../textures/VirtualTexture.js';
import { GL } from '../GL.js';
import { IResource } from '../IResource.js';
import { RenderingContext } from '../RenderingContext.js';
import { DataType } from './DataType.js';
import { InternalFormat } from './InternalFormat.js';
import { PixelFormat } from './PixelFormat.js';
import { TexParameters } from './TexParameters.js';
import { TextureTarget } from './TextureTarget.js';
import { TextureWrap } from './TextureWrap.js';

let maxAllowableAnisotropy = -1;

export class TexImage2D implements IResource {
  public readonly id = generateUUID();
  public version = 0;
  public disposed = false;
  public glTexture: WebGLTexture;
  public size = new Vec2();

  constructor(
    public context: RenderingContext,
    public images: TextureSource[],
    public internalFormat = InternalFormat.RGBA8,
    public dataType = DataType.UnsignedByte,
    public pixelFormat = PixelFormat.RGBA,
    public target = TextureTarget.Texture2D,
    public texParameters = new TexParameters()
  ) {
    const { gl, glxo, resources } = this.context;
    // Create a texture.
    {
      const glTexture = gl.createTexture();
      if (glTexture === null) {
        throw new Error('createTexture failed');
      }
      this.glTexture = glTexture;
    }

    this.loadImages(images);

    gl.texParameteri(this.target, GL.TEXTURE_WRAP_S, texParameters.wrapS);
    gl.texParameteri(this.target, GL.TEXTURE_WRAP_T, texParameters.wrapT);

    gl.texParameteri(
      this.target,
      GL.TEXTURE_MAG_FILTER,
      texParameters.magFilter
    );
    gl.texParameteri(
      this.target,
      GL.TEXTURE_MIN_FILTER,
      texParameters.minFilter
    );

    if (texParameters.anisotropyLevels > 1) {
      const tfa = glxo.EXT_texture_filter_anisotropic;
      if (tfa !== null) {
        // TODO: Cache this at some point for speed improvements
        if (maxAllowableAnisotropy === -1) {
          maxAllowableAnisotropy = gl.getParameter(
            tfa.MAX_TEXTURE_MAX_ANISOTROPY_EXT
          );
        }
        gl.texParameterf(
          this.target,
          tfa.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(texParameters.anisotropyLevels, maxAllowableAnisotropy)
        );
      }
    }

    if (texParameters.generateMipmaps) {
      gl.generateMipmap(this.target);
    }

    gl.bindTexture(this.target, null);

    resources.register(this);
  }

  generateMipmaps(): void {
    const { gl } = this.context;
    gl.bindTexture(this.target, this.glTexture);
    gl.generateMipmap(this.target);
    gl.bindTexture(this.target, null);
    this.texParameters.generateMipmaps = true;
  }

  get mipCount(): number {
    if (!this.texParameters.generateMipmaps) {
      return 1;
    }
    return Math.floor(Math.log2(Math.max(this.size.x, this.size.y)));
  }

  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.context;
    gl.deleteTexture(this.glTexture);
    resources.unregister(this);
    this.disposed = true;
  }

  public loadImages(images: TextureSource[]): void {
    const { gl } = this.context;
    gl.bindTexture(this.target, this.glTexture);
    if (images.length === 1) {
      this.loadImage(images[0]);
    } else if (this.target === TextureTarget.TextureCubeMap) {
      const numLevels = Math.floor(this.images.length / 6);
      for (let level = 0; level < numLevels; level++) {
        for (let face = 0; face < 6; face++) {
          const imageIndex = level * 6 + face;
          const image = images[imageIndex];
          this.loadImage(image, TextureTarget.CubeMapPositiveX + face, level);
        }
      }
    } else {
      throw new Error('Unsupported number of images');
    }
  }

  private loadImage(
    image: TextureSource,
    target: TextureTarget | undefined = undefined,
    level = 0
  ): void {
    const { gl } = this.context;
    if (image instanceof Vec2) {
      gl.texImage2D(
        target ?? this.target,
        level,
        this.internalFormat,
        image.x,
        image.y,
        0,
        this.pixelFormat,
        this.dataType,
        null
      );
      if (level === 0) {
        this.size.set(image.x, image.y);
      }
    } else if (image instanceof ArrayImage) {
      gl.texImage2D(
        target ?? this.target,
        level,
        this.internalFormat,
        image.width,
        image.height,
        0,
        this.pixelFormat,
        this.dataType,
        image.data
      );
      if (level === 0) {
        this.size.set(image.width, image.height);
      }
    } else {
      gl.texImage2D(
        target ?? this.target,
        level,
        this.internalFormat,
        this.pixelFormat,
        this.dataType,
        image
      );
      this.size.set(image.width, image.height);
    }
  }
}

export function textureToTexImage2D(
  context: RenderingContext,
  texture: Texture | CubeMapTexture,
  internalFormat: PixelFormat = PixelFormat.RGBA
): TexImage2D {
  //console.time('makeTexImage2DFromTexture ' + texture.name);
  const params = new TexParameters();
  params.anisotropyLevels = texture.anisotropicLevels;
  params.generateMipmaps = texture.generateMipmaps;
  params.magFilter = texture.magFilter;
  params.minFilter = texture.minFilter;
  if (texture instanceof CubeMapTexture) {
    params.wrapS = TextureWrap.ClampToEdge;
    params.wrapT = TextureWrap.ClampToEdge;
  } else {
    params.wrapS = texture.wrapS;
    params.wrapT = texture.wrapT;
  }
  const texImage2D = new TexImage2D(
    context,
    texture instanceof CubeMapTexture ? texture.images : [texture.image],
    texture.internalFormat,
    texture.dataType,
    internalFormat,
    texture instanceof CubeMapTexture
      ? TextureTarget.TextureCubeMap
      : TextureTarget.Texture2D,
    params
  );
  texImage2D.version = texture.version;
  //console.timeEnd('makeTexImage2DFromTexture ' + texture.name);

  return texImage2D;
}

/*
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
*/
