import { Vector2 } from "../../../math/Vector2";
import { GL } from "../GL";
import { RenderingContext } from "../RenderingContext";
import { DataType, sizeOfDataType } from "../textures/DataType";
import { numPixelFormatComponents, PixelFormat } from "../textures/PixelFormat";
import { TexImage2D } from "../textures/TexImage2D";
import { TexParameters } from "../textures/TexParameters";
import { TextureFilter } from "../textures/TextureFilter";
import { TextureTarget } from "../textures/TextureTarget";
import { Attachment } from "./Attachment";
import { Framebuffer } from "./Framebuffer";

export function readPixelsFromFramebuffer(
  framebuffer: Framebuffer,
  pixelBuffer: ArrayBufferView | undefined = undefined,
): ArrayBufferView {
  const context = framebuffer.context;
  context.framebuffer = framebuffer;

  const gl = context.gl;

  const status = gl.checkFramebufferStatus(GL.FRAMEBUFFER);
  if (status !== GL.FRAMEBUFFER_COMPLETE) {
    throw new Error(`can not read non-complete Framebuffer: ${status}`);
  }

  const texImage2D = framebuffer.getAttachment(Attachment.Color0);
  if (texImage2D === undefined) {
    throw new Error("no attachment on Color0");
  }

  const pixelByteLength =
    sizeOfDataType(texImage2D.dataType) *
    numPixelFormatComponents(texImage2D.pixelFormat) *
    texImage2D.size.width *
    texImage2D.size.height;
  if (pixelBuffer === undefined) {
    pixelBuffer = new Uint8Array(pixelByteLength);
  }
  if (pixelBuffer.byteLength < pixelByteLength) {
    throw new Error(`pixelBuffer too small: ${pixelBuffer.byteLength} < ${pixelByteLength}`);
  }

  gl.readPixels(
    0,
    0,
    texImage2D.size.width,
    texImage2D.size.height,
    texImage2D.pixelFormat,
    texImage2D.dataType,
    pixelBuffer,
  );

  return pixelBuffer;
}

export function makeColorAttachment(
  context: RenderingContext,
  size: Vector2,
  dataType: DataType | undefined = undefined,
): TexImage2D {
  const texParams = new TexParameters();
  texParams.generateMipmaps = false;
  texParams.magFilter = TextureFilter.Linear;
  texParams.minFilter = TextureFilter.Linear;
  return new TexImage2D(
    context,
    [size],
    PixelFormat.RGBA,
    dataType ?? DataType.UnsignedByte,
    PixelFormat.RGBA,
    TextureTarget.Texture2D,
    texParams,
  );
}

export function makeDepthAttachment(context: RenderingContext, size: Vector2): TexImage2D {
  const texParams = new TexParameters();
  texParams.generateMipmaps = false;
  texParams.magFilter = TextureFilter.Nearest;
  texParams.minFilter = TextureFilter.Nearest;
  // TODO: figure out which are supported and choose one of those.
  // context.glx.WEBGL_depth_texture.UNSIGNED_INT_24_8_WEBGL as DataType,
  const dataType = DataType.UnsignedShort;

  return new TexImage2D(
    context,
    [size],
    PixelFormat.DepthComponent,
    dataType,
    PixelFormat.DepthComponent,
    TextureTarget.Texture2D,
    texParams,
  );
}
