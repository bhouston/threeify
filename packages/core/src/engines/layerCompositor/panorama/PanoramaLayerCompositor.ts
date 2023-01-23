import { transformGeometry } from '../../../geometry/Geometry.Functions';
import { octahedronGeometry } from '../../../geometry/primitives/polyhedronGeometry';
import { ShaderMaterial } from '../../../materials/ShaderMaterial';
import { Color3 } from '../../../math/Color3';
import { Euler3, EulerOrder3 } from '../../../math/Euler3';
import {
  angleAxisToMat4,
  euler3ToMat4,
  mat4Inverse,
  mat4Multiply,
  mat4PerspectiveFov,
  scale3ToMat4
} from '../../../math/Mat4.Functions';
import { Vec3 } from '../../../math/Vec3';
import {
  BufferGeometry,
  makeBufferGeometryFromGeometry
} from '../../../renderers/webgl/buffers/BufferGeometry';
import { ClearState } from '../../../renderers/webgl/ClearState';
import { renderBufferGeometry } from '../../../renderers/webgl/framebuffers/VirtualFramebuffer';
import {
  makeProgramFromShaderMaterial,
  Program
} from '../../../renderers/webgl/programs/Program';
import { UniformValueMap } from '../../../renderers/webgl/programs/UniformValueMap';
import { TextureWrap } from '../../../renderers/webgl/textures/TextureWrap';
import { copySourceBlendState } from '../Layer';
import {
  ImageFitMode,
  LayerCompositor,
  makeColorMipmapAttachment
} from '../LayerCompositor';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

export class PanoramaLayerCompositor extends LayerCompositor {
  public angle = new Euler3(0, 0, 0, EulerOrder3.ZYX);
  public fov = 90;
  #sphereGeometry: BufferGeometry;
  #sphereProgram: Program;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    const sphere = octahedronGeometry(1, 6); // artefacts are visible at detail=4 but not 5
    transformGeometry(
      sphere,
      mat4Multiply(
        scale3ToMat4(new Vec3(-1, 1, -1)),
        angleAxisToMat4(new Vec3(0, 1, 0), Math.PI / 2)
      )
    );
    this.#sphereGeometry = makeBufferGeometryFromGeometry(this.context, sphere);
    this.#sphereProgram = makeProgramFromShaderMaterial(
      this.context,
      new ShaderMaterial(vertex, fragment)
    );
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

    canvasFramebuffer.clearState = new ClearState(new Color3(0, 0, 0), 0);
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
      program: this.#sphereProgram,
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
