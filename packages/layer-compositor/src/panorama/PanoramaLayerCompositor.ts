import {
  BufferGeometry,
  ClearState,
  geometryToBufferGeometry,
  octahedronGeometry,
  Program,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  shaderMaterialToProgram,
  TextureWrap,
  transformGeometry,
  UniformValueMap
} from '@threeify/core';
import {
  angleAxisToMat4,
  Color3,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  mat4Inverse,
  mat4Multiply,
  mat4PerspectiveFov,
  scale3ToMat4,
  Vec3
} from '@threeify/math';

import fragmentSource from '../fragment.glsl';
import { copySourceBlendState } from '../Layer';
import {
  ImageFitMode,
  LayerCompositor,
  makeColorMipmapAttachment
} from '../LayerCompositor';
import vertexSource from '../vertex.glsl';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

export async function createPanoramaLayerCompositor( // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  canvas: HTMLCanvasElement
): Promise<PanoramaLayerCompositor> {
  const context = new RenderingContext(canvas, {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: true,
    stencil: false,
    preserveDrawingBuffer: true
  });
  const program = await shaderMaterialToProgram(
    context,
    new ShaderMaterial('layerComposite', vertexSource, fragmentSource)
  );
  const sphereProgram = await shaderMaterialToProgram(
    context,
    new ShaderMaterial('panoramicLayerCompositor', vertex, fragment)
  );
  const layerCompositor = new PanoramaLayerCompositor(
    canvas,
    context,
    program,
    sphereProgram
  );
  return layerCompositor;
}

export class PanoramaLayerCompositor extends LayerCompositor {
  public angle = new Euler3(0, 0, 0, EulerOrder3.ZYX);
  public fov = 90;
  #sphereGeometry: BufferGeometry;

  constructor(
    canvas: HTMLCanvasElement,
    context: RenderingContext,
    program: Program,
    private readonly sphereProgram: Program
  ) {
    super(canvas, context, program);
    const sphere = octahedronGeometry(1, 6); // artefacts are visible at detail=4 but not 5
    transformGeometry(
      sphere,
      mat4Multiply(
        scale3ToMat4(new Vec3(-1, 1, -1)),
        angleAxisToMat4(new Vec3(0, 1, 0), Math.PI / 2)
      )
    );
    this.#sphereGeometry = geometryToBufferGeometry(this.context, sphere);
  }

  render(): void {
    this.renderId++;
    // console.log(`render id: ${this.renderId}`);

    this.renderLayersToFramebuffer();

    const offscreenColorAttachment = this.offscreenWriteColorAttachment;
    if (offscreenColorAttachment === undefined) {
      return;
    }

    const canvasFramebuffer = this.context.canvasFramebuffer;
    const canvasSize = canvasFramebuffer.size;
    const canvasAspectRatio = canvasSize.x / canvasSize.y;

    canvasFramebuffer.clearState = new ClearState(Color3.Black, 0);
    canvasFramebuffer.clear();

    let verticalFov = this.fov / 2;
    if (this.imageFitMode === ImageFitMode.FitWidth)
      verticalFov /= canvasAspectRatio;

    const uniforms: UniformValueMap = {
      localToView: mat4Inverse(euler3ToMat4(this.angle)),
      viewToScreen: mat4PerspectiveFov(
        verticalFov,
        0.1,
        10,
        this.zoomScale,
        canvasAspectRatio
      ),

      mipmapBias: 0,
      convertToPremultipliedAlpha: 0,

      layerMap: offscreenColorAttachment!
    };

    //console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program: this.sphereProgram,
      uniforms,
      bufferGeometry: this.#sphereGeometry,
      blendState: copySourceBlendState
    });

    if (this.autoDiscard) {
      for (const url in this.layerImageCache) {
        const layerImage = this.layerImageCache[url];
        if (layerImage !== undefined && layerImage.renderId < this.renderId) {
          this.discardTexImage2D(url);
        }
      }
    }
  }

  makeColorMipmapAttachment() {
    return makeColorMipmapAttachment(
      this.context,
      this.offscreenSize,
      undefined,
      {
        wrapS: TextureWrap.Repeat,
        wrapT: TextureWrap.ClampToEdge
      }
    );
  }
}
