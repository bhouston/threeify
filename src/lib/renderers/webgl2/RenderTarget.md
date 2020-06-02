export class RenderTarget IDisposeable

disposed: boolean = false;
width: number;
height: number;

glRenderTarget: WebGLRenderTarget or null;

clear( color: Color, alpha: number )
render( program: Program, vao: VertexArrayObject, uniforms: Array<Uniforms> );
clone()
dispose()
