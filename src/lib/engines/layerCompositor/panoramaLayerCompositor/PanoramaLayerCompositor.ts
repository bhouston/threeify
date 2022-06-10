import { ImageFitMode, LayerCompositor, makeColorMipmapAttachment } from "./../LayerCompositor";
import { transformGeometry } from "../../../geometry/Geometry.Functions";
import { ShaderMaterial } from "../../../materials/ShaderMaterial";
import {
  makeMatrix4Concatenation,
  makeMatrix4Inverse,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromAngleAxis,
  makeMatrix4RotationFromEuler,
  makeMatrix4Scale,
} from "../../../math/Matrix4.Functions";
import { Vector3 } from "../../../math/Vector3";
import { UniformValueMap } from "../../../renderers";
import { BufferGeometry, makeBufferGeometryFromGeometry } from "../../../renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../renderers/webgl/ClearState";
import { renderBufferGeometry } from "../../../renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial, Program } from "../../../renderers/webgl/programs/Program";
import { TextureWrap } from "../../../renderers/webgl/textures/TextureWrap";
import fragment from "./fragment.glsl";
import vertex from "./vertex.glsl";
import { copySourceBlendState } from "./../Layer";
import { octahedronGeometry } from "../../../geometry";
import { Euler, EulerOrder } from "../../../math";

export class PanoramaLayerCompositor extends LayerCompositor {
  public angle = new Euler(0, 0, 0, EulerOrder.ZYX);
  public fov = 90;
  #sphereGeometry: BufferGeometry;
  #sphereProgram: Program;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    const sphere = octahedronGeometry(1, 6); // artefacts are visible at detail=4 but not 5
    transformGeometry(
      sphere,
      makeMatrix4Concatenation(
        makeMatrix4Scale(new Vector3(-1, 1, -1)),
        makeMatrix4RotationFromAngleAxis(new Vector3(0, 1, 0), Math.PI / 2),
      ),
    );
    this.#sphereGeometry = makeBufferGeometryFromGeometry(this.context, sphere);
    this.#sphereProgram = makeProgramFromShaderMaterial(this.context, new ShaderMaterial(vertex, fragment));
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
    const canvasAspectRatio = canvasSize.width / canvasSize.height;

    canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 0.0);
    canvasFramebuffer.clear();

    let verticalFov = this.fov / 2;
    if (this.imageFitMode === ImageFitMode.FitWidth) verticalFov /= canvasAspectRatio;

    let uniforms: UniformValueMap = {
      localToView: makeMatrix4Inverse(makeMatrix4RotationFromEuler(this.angle)),
      viewToScreen: makeMatrix4PerspectiveFov(verticalFov, 0.1, 10, this.zoomScale, canvasAspectRatio),

      mipmapBias: 0,
      convertToPremultipliedAlpha: 0,

      layerMap: offscreenColorAttachment!,
    };

    //console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
    renderBufferGeometry(
      canvasFramebuffer,
      this.#sphereProgram,
      uniforms,
      this.#sphereGeometry,
      undefined,
      copySourceBlendState,
    );

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
    return makeColorMipmapAttachment(this.context, this.offscreenSize, undefined, {
      wrapS: TextureWrap.Repeat,
      wrapT: TextureWrap.ClampToEdge,
    });
  }
}
