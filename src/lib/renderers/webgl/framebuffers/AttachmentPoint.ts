import { GL } from "../GL";

export enum AttachmentPoint {
  Color0 = GL.COLOR_ATTACHMENT0,
  Depth = GL.DEPTH_ATTACHMENT,
  DepthStencil = GL.DEPTH_STENCIL_ATTACHMENT,
  Stencil = GL.STENCIL_ATTACHMENT,
}
