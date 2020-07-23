//
// OpenGL texture representation based on texImage2D function call
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../../core/types";
import { passGeometry } from "../../../geometry/primitives/passGeometry";
import { ShaderMaterial } from "../../../materials/ShaderMaterial";
import { Vector2 } from "../../../math/Vector2";
import { ArrayBufferImage } from "../../../textures/ArrayBufferImage";
import { cubeMapFaces, CubeMapTexture } from "../../../textures/CubeTexture";
import { Texture } from "../../../textures/Texture";
import { TextureSource } from "../../../textures/VirtualTexture";
import { Pool } from "../../Pool";
import { makeBufferGeometryFromGeometry } from "../buffers/BufferGeometry";
import { Attachment } from "../framebuffers/Attachment";
import { Framebuffer } from "../framebuffers/Framebuffer";
import { GL } from "../GL";
import { makeProgramFromShaderMaterial } from "../programs/Program";
import { RenderingContext } from "../RenderingContext";
import { TextureFilter } from "../textures/TextureFilter";
import cubeFaceFragmentSource from "./cubeFaces/fragment.glsl";
import cubeFaceVertexSource from "./cubeFaces/vertex.glsl";
import { DataType } from "./DataType";
import { PixelFormat } from "./PixelFormat";
import { TexParameters } from "./TexParameters";
import { TextureTarget } from "./TextureTarget";
import { TextureWrap } from "./TextureWrap";

export class TexImage2D implements IDisposable {
  disposed = false;
  glTexture: WebGLTexture;
  size = new Vector2();

  constructor(
    public context: RenderingContext,
    public images: TextureSource[],
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

  generateMipmaps(): void {
    const gl = this.context.gl;
    gl.bindTexture(this.target, this.glTexture);
    gl.generateMipmap(this.target);
    gl.bindTexture(this.target, null);
    this.texParameters.generateMipmaps = true;
  }

  get mipCount(): number {
    if (!this.texParameters.generateMipmaps) {
      return 1;
    }
    return Math.floor(Math.log2(Math.max(this.size.width, this.size.height)));
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
      throw new Error("Unsupported number of images");
    }
  }

  private loadImage(image: TextureSource, target: TextureTarget | undefined = undefined, level = 0): void {
    const gl = this.context.gl;

    if (image instanceof Vector2) {
      gl.texImage2D(
        target ?? this.target,
        level,
        this.internalFormat,
        image.width,
        image.height,
        0,
        this.pixelFormat,
        this.dataType,
        null,
      );
      if (level === 0) {
        this.size.copy(image);
      }
    } else if (image instanceof ArrayBufferImage) {
      gl.texImage2D(
        target ?? this.target,
        level,
        this.internalFormat,
        image.width,
        image.height,
        0,
        this.pixelFormat,
        this.dataType,
        new Uint8Array(image.data),
      );
      if (level === 0) {
        this.size.set(image.width, image.height);
      }
    } else {
      gl.texImage2D(target ?? this.target, level, this.internalFormat, this.pixelFormat, this.dataType, image);
      this.size.set(image.width, image.height);
    }
  }
}

export function makeTexImage2DFromTexture(
  context: RenderingContext,
  texture: Texture,
  internalFormat: PixelFormat = PixelFormat.RGBA,
): TexImage2D {
  const params = new TexParameters();
  params.anisotropyLevels = texture.anisotropicLevels;
  params.generateMipmaps = texture.generateMipmaps;
  params.magFilter = texture.magFilter;
  params.minFilter = texture.minFilter;
  params.wrapS = texture.wrapS;
  params.wrapT = texture.wrapT;
  return new TexImage2D(
    context,
    [texture.image],
    texture.pixelFormat,
    texture.dataType,
    internalFormat,
    TextureTarget.Texture2D,
    params,
  );
}

export function makeTexImage2DFromCubeTexture(
  context: RenderingContext,
  texture: CubeMapTexture,
  internalFormat: PixelFormat = PixelFormat.RGBA,
): TexImage2D {
  const params = new TexParameters();
  params.anisotropyLevels = texture.anisotropicLevels;
  params.generateMipmaps = texture.generateMipmaps;
  params.magFilter = texture.magFilter;
  params.minFilter = texture.minFilter;
  params.wrapS = TextureWrap.ClampToEdge;
  params.wrapT = TextureWrap.ClampToEdge;
  return new TexImage2D(
    context,
    texture.images,
    texture.pixelFormat,
    texture.dataType,
    internalFormat,
    TextureTarget.TextureCubeMap,
    params,
  );
}

export function makeTexImage2DFromEquirectangularTexture(
  context: RenderingContext,
  equirectangularTexture: Texture,
  faceSize = new Vector2(512, 512),
  generateMipmaps = true,
): TexImage2D {
  // required for proper reading.
  equirectangularTexture.wrapS = TextureWrap.Repeat;
  equirectangularTexture.wrapT = TextureWrap.ClampToEdge;
  equirectangularTexture.minFilter = TextureFilter.Linear;

  const cubeTexture = new CubeMapTexture([faceSize, faceSize, faceSize, faceSize, faceSize, faceSize]);
  cubeTexture.generateMipmaps = generateMipmaps;

  const equirectangularMap = makeTexImage2DFromTexture(context, equirectangularTexture);
  const cubeFaceGeometry = passGeometry();
  const cubeFaceMaterial = new ShaderMaterial(cubeFaceVertexSource, cubeFaceFragmentSource);
  const cubeFaceProgram = makeProgramFromShaderMaterial(context, cubeFaceMaterial);
  const cubeFaceBufferGeometry = makeBufferGeometryFromGeometry(context, cubeFaceGeometry);
  const cubeMap = makeTexImage2DFromCubeTexture(context, cubeTexture);

  const cubeFaceFramebuffer = new Framebuffer(context);

  const cubeFaceUniforms = {
    map: equirectangularMap,
    faceIndex: 0,
  };

  cubeMapFaces.forEach((cubeMapFace) => {
    cubeFaceFramebuffer.attach(Attachment.Color0, cubeMap, cubeMapFace.target, 0);
    cubeFaceUniforms.faceIndex = cubeMapFace.index;
    cubeFaceFramebuffer.renderBufferGeometry(cubeFaceProgram, cubeFaceUniforms, cubeFaceBufferGeometry);
  });

  if (generateMipmaps) {
    cubeMap.generateMipmaps();
  }

  cubeFaceFramebuffer.dispose();
  cubeFaceBufferGeometry.dispose();
  cubeFaceProgram.dispose();
  cubeFaceGeometry.dispose();
  equirectangularMap.dispose();

  return cubeMap;
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
