import { Vec2 } from '@threeify/vector-math';

import { GL } from '../GL.js';
import { RenderingContext } from '../RenderingContext.js';
import { DataType, sizeOfDataType } from '../textures/DataType.js';
import {
  numPixelFormatComponents,
  PixelFormat
} from '../textures/PixelFormat.js';
import { TexImage2D } from '../textures/TexImage2D.js';
import { TexParameters } from '../textures/TexParameters.js';
import { TextureFilter } from '../textures/TextureFilter.js';
import { TextureTarget } from '../textures/TextureTarget.js';
import { TextureWrap } from '../textures/TextureWrap.js';
import { Attachment } from './Attachment.js';
import { Framebuffer } from './Framebuffer.js';

export function readPixelsFromFramebuffer(
  framebuffer: Framebuffer,
  pixelBuffer: ArrayBufferView | undefined = undefined
): ArrayBufferView {
  const { context } = framebuffer;
  context.framebuffer = framebuffer;

  const { gl } = context;

  const status = gl.checkFramebufferStatus(GL.FRAMEBUFFER);
  if (status !== GL.FRAMEBUFFER_COMPLETE) {
    throw new Error(`can not read non-complete Framebuffer: ${status}`);
  }

  const texImage2D = framebuffer.getAttachment(Attachment.Color0);
  if (texImage2D === undefined) {
    throw new Error('no attachment on Color0');
  }

  const pixelByteLength =
    sizeOfDataType(texImage2D.dataType) *
    numPixelFormatComponents(texImage2D.pixelFormat) *
    texImage2D.size.x *
    texImage2D.size.y;
  if (pixelBuffer === undefined) {
    pixelBuffer = new Uint8Array(pixelByteLength);
  }
  if (pixelBuffer.byteLength < pixelByteLength) {
    throw new Error(
      `pixelBuffer too small: ${pixelBuffer.byteLength} < ${pixelByteLength}`
    );
  }

  gl.readPixels(
    0,
    0,
    texImage2D.size.x,
    texImage2D.size.y,
    texImage2D.pixelFormat,
    texImage2D.dataType,
    pixelBuffer
  );

  return pixelBuffer;
}

export function makeColorAttachment(
  context: RenderingContext,
  size: Vec2,
  dataType: DataType | undefined = undefined,
  magFilter: TextureFilter = TextureFilter.Linear,
  minFilter: TextureFilter = TextureFilter.Linear
): TexImage2D {
  const texParams = new TexParameters();
  texParams.generateMipmaps = false;
  texParams.magFilter = magFilter;
  texParams.minFilter = minFilter;
  return new TexImage2D(
    context,
    [size],
    PixelFormat.RGBA,
    dataType ?? DataType.UnsignedByte,
    PixelFormat.RGBA,
    TextureTarget.Texture2D,
    texParams
  );
}

export function makeDepthAttachment(
  context: RenderingContext,
  size: Vec2
): TexImage2D {
  const texParams = new TexParameters();
  texParams.generateMipmaps = false;
  texParams.magFilter = TextureFilter.Nearest;
  texParams.minFilter = TextureFilter.Nearest;
  texParams.wrapS = TextureWrap.ClampToEdge;
  texParams.wrapT = TextureWrap.ClampToEdge;
  // TODO: figure out which are supported and choose one of those.
  // context.glx.WEBGL_depth_texture.UNSIGNED_INT_24_8_WEBGL as DataType,
  const dataType = DataType.UnsignedInt;

  return new TexImage2D(
    context,
    [size],
    PixelFormat.DepthComponent24, // In WebGL2 DEPTH_COMPONENT is not a valid internal format. Use DEPTH_COMPONENT16, DEPTH_COMPONENT24 or DEPTH_COMPONENT32F
    dataType,
    PixelFormat.DepthComponent,
    TextureTarget.Texture2D,
    texParams
  );
}
