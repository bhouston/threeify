import { Vector2 } from "../../../math/Vector2";
import { RenderingContext } from "../RenderingContext";
import { DataType } from "../textures/DataType";
import { PixelFormat } from "../textures/PixelFormat";
import { TexImage2D } from "../textures/TexImage2D";
import { TexParameters } from "../textures/TexParameters";
import { TextureFilter } from "../textures/TextureFilter";
import { TextureTarget } from "../textures/TextureTarget";
import { AttachmentPoint } from "./AttachmentPoint";

export class Attachment {
  constructor(public attachmentPoint: number, public texImage2D: TexImage2D) {}
}

export function makeColorAttachment(
  context: RenderingContext,
  size: Vector2,
  attachmentOffset: number,
  dataType: DataType | undefined = undefined,
): Attachment {
  const texParams = new TexParameters();
  texParams.generateMipmaps = false;
  texParams.magFilter = TextureFilter.Linear;
  texParams.minFilter = TextureFilter.Linear;
  return new Attachment(
    AttachmentPoint.Color0 + attachmentOffset,
    new TexImage2D(
      context,
      [],
      size,
      0,
      PixelFormat.RGBA,
      dataType ?? DataType.UnsignedByte,
      PixelFormat.RGBA,
      TextureTarget.Texture2D,
      texParams,
    ),
  );
}

export function makeDepthAttachment(context: RenderingContext, size: Vector2): Attachment {
  const texParams = new TexParameters();
  texParams.generateMipmaps = false;
  texParams.magFilter = TextureFilter.Nearest;
  texParams.minFilter = TextureFilter.Nearest;

  // TODO: figure out which are supported and choose one of those.
  // context.glx.WEBGL_depth_texture.UNSIGNED_INT_24_8_WEBGL as DataType,
  const dataType = DataType.UnsignedShort;

  return new Attachment(
    AttachmentPoint.Depth,
    new TexImage2D(
      context,
      [],
      size,
      0,
      PixelFormat.DepthComponent,
      dataType,
      PixelFormat.DepthComponent,
      TextureTarget.Texture2D,
      texParams,
    ),
  );
}
