const GL = WebGLRenderingContext;

export enum Attachments {
  Color = GL.COLOR_BUFFER_BIT,
  Depth = GL.DEPTH_BUFFER_BIT,
  Stencil = GL.STENCIL_BUFFER_BIT,
  Default = Color | Depth,
  All = Color | Depth | Stencil,
}
