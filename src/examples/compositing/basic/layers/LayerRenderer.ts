import { planeGeometry } from "../../../../lib/geometry/primitives/planeGeometry";
import { Blending } from "../../../../lib/materials/Blending";
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
import { transformPoint } from "../../../../lib/math/Vector3Matrix4.Functions";
import { blendModeToBlendState, BlendState } from "../../../../lib/renderers/webgl/BlendState";
import { BufferGeometry, makeBufferGeometryFromGeometry } from "../../../../lib/renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../../lib/renderers/webgl/ClearState";
import { BufferBit } from "../../../../lib/renderers/webgl/framebuffers/BufferBit";
import {
  renderBufferGeometry,
  VirtualFramebuffer,
} from "../../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial, Program } from "../../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture, TexImage2D } from "../../../../lib/renderers/webgl/textures/TexImage2D";
import { TextureWrap } from "../../../../lib/renderers/webgl/textures/TextureWrap";
import { Texture } from "../../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import { Layer } from "./Layer";
import vertexSource from "./vertex.glsl";

export type TexImage2DMap = { [key: string]: TexImage2D | undefined };

export class LayerRenderer {
  context: RenderingContext;
  texImage2DCache: TexImage2DMap = {};
  #bufferGeometry: BufferGeometry;
  #program: Program;
  #blendState: BlendState;
  screenToView = new Matrix4();
  viewToScreen = new Matrix4();
  renderSize = new Vector2();
  layerMaxSize = new Vector2(1000, 1000);
  zoomScale = 1.0; // no zoom
  panPosition: Vector2 = new Vector2(0.5, 0.5); // center
  layers: Layer[] = [];
  firstRender = true;
  backgroundColor = new Vector3(1, 1, 1);

  constructor(canvas: HTMLCanvasElement) {
    this.context = new RenderingContext(canvas);
    this.#bufferGeometry = makeBufferGeometryFromGeometry(this.context, planeGeometry(1, 1, 1, 1));
    this.#program = makeProgramFromShaderMaterial(this.context, new ShaderMaterial(vertexSource, fragmentSource));
    this.#blendState = blendModeToBlendState(Blending.Over, false);
  }

  // have a sizeChanged function (for when the div changes size.)
  updateSize(framebuffer: VirtualFramebuffer): void {
    const renderSize = framebuffer.size;
    if (!renderSize.equals(this.renderSize)) {
      // console.log(`resizing canvas framebuffer to (${renderSize.x} ${renderSize.y})`);
      const renderAspectRatio = renderSize.width / renderSize.height;
      this.viewToScreen = makeMatrix4OrthographicSimple(
        renderSize.height,
        new Vector2(0.0, 0.0),
        0.1,
        3,
        1,
        renderAspectRatio,
      );
      this.screenToView = makeMatrix4Inverse(this.viewToScreen);
      this.renderSize.copy(renderSize);
    }
  }

  loadTexImage2D(key: string, image: HTMLImageElement | ImageBitmap): Promise<TexImage2D> {
    return new Promise<TexImage2D>((resolve) => {
      // check for texture in cache.
      const cachedTexImage2D = this.texImage2DCache[key];
      if (cachedTexImage2D !== undefined && !cachedTexImage2D.disposed) {
        return resolve(cachedTexImage2D);
      }
      // create texture
      const texture = new Texture(image);
      texture.wrapS = TextureWrap.ClampToEdge;
      texture.wrapT = TextureWrap.ClampToEdge;
      texture.generateMipmaps = true;
      texture.anisotropicLevels = 1;
      texture.name = key;

      // load texture onto the GPU
      const texImage2D = makeTexImage2DFromTexture(this.context, texture);
      this.texImage2DCache[key] = texImage2D;
      return resolve(texImage2D);
    });
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
    if (this.firstRender) {
      console.log("renderSize", this.renderSize);
      console.log("layerMaxSize", this.layerMaxSize);
      console.log("fitScale", fitScale);
      console.log("zoomScale", this.zoomScale);
      console.log("scale", scale);
    }

    // convert from layer pixel space to view space using zoom and pan
    const worldToViewTranslation = makeMatrix4Translation(
      new Vector3(this.panPosition.x - this.layerMaxSize.x * 0.5, this.panPosition.y - this.layerMaxSize.y * 0.5, 0.0),
    );
    const worldToViewScale = makeMatrix4Scale(new Vector3(scale, scale, 1.0));
    const worldToView = makeMatrix4Concatenation(worldToViewScale, worldToViewTranslation);

    // TODO: cache this.  Maybe expose it as this.clearState to allow setting bg alpha.
    const whiteClearState = new ClearState(this.backgroundColor, 1.0);
    framebuffer.clear(BufferBit.All, whiteClearState);

    this.layers.forEach((layer, index) => {
      const uniforms = {
        screenToView: this.screenToView,
        viewToScreen: this.viewToScreen,
        worldToView: worldToView,
        localToWorld: layer.localToWorld,
        layerMap: layer.texImage2D,
      };

      if (this.firstRender) {
        console.log(`layer ${index}:`);
        const localTopLeft = new Vector3(0, 0, 0);
        const localBottomRight = new Vector3(1, 1, 0);
        console.log("  local:", localTopLeft, localBottomRight);
        const worldTopLeft = transformPoint(localTopLeft, uniforms.localToWorld);
        const worldBottomRight = transformPoint(localBottomRight, uniforms.localToWorld);
        console.log("  world:", worldTopLeft, worldBottomRight);
        const viewTopLeft = transformPoint(worldTopLeft, uniforms.worldToView);
        const viewBottomRight = transformPoint(worldBottomRight, uniforms.worldToView);
        console.log("  view:", viewTopLeft, viewBottomRight);
        const screenTopLeft = transformPoint(viewTopLeft, uniforms.viewToScreen);
        const screenBottomRight = transformPoint(viewBottomRight, uniforms.viewToScreen);
        console.log("  screen:", screenTopLeft, screenBottomRight);
        this.firstRender = false;
      }

      // console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
      renderBufferGeometry(framebuffer, this.#program, uniforms, this.#bufferGeometry, undefined, this.#blendState);
    });
  }
}
