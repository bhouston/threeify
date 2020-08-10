import { planeGeometry } from "../../../../lib/geometry/primitives/planeGeometry";
import { ShaderMaterial } from "../../../../lib/materials/ShaderMaterial";
import { Matrix4 } from "../../../../lib/math/Matrix4";
import {
  makeMatrix4Concatenation,
  makeMatrix4Inverse,
  makeMatrix4OrthographicSimple,
  makeMatrix4Scale,
  makeMatrix4Translation,
} from "../../../../lib/math/Matrix4.Functions";
import { Vector2 } from "../../../../lib/math/Vector2";
import { Vector3 } from "../../../../lib/math/Vector3";
import { BufferGeometry, makeBufferGeometryFromGeometry } from "../../../../lib/renderers/webgl/buffers/BufferGeometry";
import {
  renderBufferGeometry,
  VirtualFramebuffer,
} from "../../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial, Program } from "../../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../../lib/renderers/webgl/textures/TexImage2D";
import { TextureWrap } from "../../../../lib/renderers/webgl/textures/TextureWrap";
import { fetchImage } from "../../../../lib/textures/loaders/Image";
import { Texture } from "../../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import { Layer } from "./Layer";
import vertexSource from "./vertex.glsl";

export type LayerMap = { [key: string]: Layer | undefined };

export class LayerRenderer {
  #context: RenderingContext;
  layerCache: LayerMap = {};
  #bufferGeometry: BufferGeometry;
  #program: Program;
  screenToView = new Matrix4();
  viewToScreen = new Matrix4();
  renderSize = new Vector2();
  layerMaxSize = new Vector2(1000, 1000);
  zoomScale = 1.0; // no zoom
  panPosition: Vector2 = new Vector2(0.5, 0.5); // center
  layers: Layer[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.#context = new RenderingContext(canvas);
    this.#bufferGeometry = makeBufferGeometryFromGeometry(this.#context, planeGeometry(1, 1, 1, 1));
    this.#program = makeProgramFromShaderMaterial(this.#context, new ShaderMaterial(vertexSource, fragmentSource));
  }

  // have a sizeChanged function (for when the div changes size.)
  updateSize(framebuffer: VirtualFramebuffer): void {
    const renderSize = framebuffer.size;
    if (!renderSize.equals(this.renderSize)) {
      const renderAspectRatio = renderSize.height / renderSize.width;
      this.viewToScreen = makeMatrix4OrthographicSimple(1.0, new Vector2(0.0, 0.0), 0, 1, 0, renderAspectRatio);
      this.screenToView = makeMatrix4Inverse(this.viewToScreen);
      this.renderSize.copy(renderSize);
    }
  }

  // preload image URL, returns promise?
  fetchLayer(url: string, offset: Vector2, size: Vector2): Promise<Layer> {
    const layerPromise = new Promise<Layer>((resolve, reject) => {
      // check for cached layer
      const cachedLayer = this.layerCache[url];
      if (cachedLayer !== undefined && !cachedLayer.disposed) {
        return resolve(cachedLayer);
      }

      // TODO: use ImageBitmap instead of HTMLImageElement
      fetchImage(url).then((image) => {
        // load texture
        const texture = new Texture(image);
        texture.wrapS = TextureWrap.ClampToEdge;
        texture.wrapT = TextureWrap.ClampToEdge;
        texture.generateMipmaps = true;
        texture.anisotropicLevels = 1;
        texture.name = url;

        // create layer
        const layer = new Layer(this, url, makeTexImage2DFromTexture(this.#context, texture), offset, size);
        this.layerCache[url] = layer;
        return resolve(layer);
      });
    });
    return layerPromise;
  }

  // ask how much memory is used
  // set max size
  // draw() - makes things fit with size of div assuming pixels are square
  render(framebuffer: VirtualFramebuffer): void {
    framebuffer.clear();

    // TODO: Cache more of these matrices.
    this.updateSize(framebuffer);

    // shrink to fit within render target
    const fitScale = Math.min(
      this.renderSize.width / this.layerMaxSize.width,
      this.renderSize.height / this.layerMaxSize.height,
    );
    const scale = fitScale * this.zoomScale;

    // convert from layer pixel space to view space using zoom and pan
    const worldToViewTranslation = makeMatrix4Translation(new Vector3(this.panPosition.x, this.panPosition.y, 0.5));
    const worldToViewScale = makeMatrix4Scale(new Vector3(scale, scale, scale));
    const worldToView = makeMatrix4Concatenation(worldToViewTranslation, worldToViewScale);

    this.layers.forEach((layer) => {
      const uniforms = {
        screenToView: this.screenToView,
        viewToScreen: this.viewToScreen,
        worldToView: worldToView,
        localToWorld: layer.localToWorld,
        layerMap: layer.texImage2D,
      };

      renderBufferGeometry(framebuffer, this.#program, uniforms, this.#bufferGeometry);
    });
  }
}
