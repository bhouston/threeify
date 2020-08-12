import { transformGeometry } from "../../../../lib/geometry/Geometry.Functions";
import { planeGeometry } from "../../../../lib/geometry/primitives/planeGeometry";
import { Blending } from "../../../../lib/materials/Blending";
import { ShaderMaterial } from "../../../../lib/materials/ShaderMaterial";
import { ceilPow2 } from "../../../../lib/math/Functions";
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
import { blendModeToBlendState, BlendState } from "../../../../lib/renderers/webgl/BlendState";
import { BufferGeometry, makeBufferGeometryFromGeometry } from "../../../../lib/renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../../lib/renderers/webgl/ClearState";
import { Attachment } from "../../../../lib/renderers/webgl/framebuffers/Attachment";
import { Framebuffer } from "../../../../lib/renderers/webgl/framebuffers/Framebuffer";
import { renderBufferGeometry } from "../../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial, Program } from "../../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../../lib/renderers/webgl/RenderingContext";
import { DataType } from "../../../../lib/renderers/webgl/textures/DataType";
import { PixelFormat } from "../../../../lib/renderers/webgl/textures/PixelFormat";
import { makeTexImage2DFromTexture, TexImage2D } from "../../../../lib/renderers/webgl/textures/TexImage2D";
import { TexParameters } from "../../../../lib/renderers/webgl/textures/TexParameters";
import { TextureFilter } from "../../../../lib/renderers/webgl/textures/TextureFilter";
import { TextureTarget } from "../../../../lib/renderers/webgl/textures/TextureTarget";
import { TextureWrap } from "../../../../lib/renderers/webgl/textures/TextureWrap";
import { Texture } from "../../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import { Layer } from "./Layer";
import vertexSource from "./vertex.glsl";

export type TexImage2DMap = { [key: string]: TexImage2D | undefined };

export function makeColorMipmapAttachment(
  context: RenderingContext,
  size: Vector2,
  dataType: DataType | undefined = undefined,
): TexImage2D {
  const texParams = new TexParameters();
  texParams.generateMipmaps = true;
  texParams.magFilter = TextureFilter.Linear;
  texParams.minFilter = TextureFilter.LinearMipmapLinear;
  return new TexImage2D(
    context,
    [size],
    PixelFormat.RGBA,
    dataType ?? DataType.UnsignedByte,
    PixelFormat.RGBA,
    TextureTarget.Texture2D,
    texParams,
  );
}

export class LayerRenderer {
  context: RenderingContext;
  texImage2DCache: TexImage2DMap = {};
  #bufferGeometry: BufferGeometry;
  #program: Program;
  #blendState: BlendState;
  screenToView = new Matrix4();
  viewToScreen = new Matrix4();
  viewportSize = new Vector2();
  layerSize = new Vector2(0, 0);
  zoomScale = 1.0; // no zoom
  panPosition: Vector2 = new Vector2(0.5, 0.5); // center
  layers: Layer[] = [];
  firstRender = true;
  clearState = new ClearState(new Vector3(1, 1, 1), 1.0);
  framebuffer: Framebuffer | undefined;
  framebufferSize = new Vector2(0, 0);
  framebufferColorAttachment: TexImage2D | undefined;
  framebufferViewToScreen = new Matrix4();
  framebufferScreenToView = new Matrix4();

  constructor(canvas: HTMLCanvasElement) {
    this.context = new RenderingContext(canvas);
    const plane = planeGeometry(1, 1, 1, 1);
    transformGeometry(plane, makeMatrix4Translation(new Vector3(0.5, 0.5, -1.0)));
    this.#bufferGeometry = makeBufferGeometryFromGeometry(this.context, plane);
    this.#program = makeProgramFromShaderMaterial(this.context, new ShaderMaterial(vertexSource, fragmentSource));
    this.#blendState = blendModeToBlendState(Blending.Over, false);
  }

  updateFramebuffer(): void {
    // but to enable mipmaps (for filtering) we need it to be up-rounded to a power of 2 in width/height.
    const framebufferSize = new Vector2(ceilPow2(this.layerSize.x), ceilPow2(this.layerSize.y));
    if (this.framebuffer === undefined || !this.framebufferSize.equals(framebufferSize)) {
      // console.log("updating framebuffer");

      if (this.framebuffer !== undefined) {
        this.framebuffer.dispose();
        this.framebuffer = undefined;
      }
      this.framebufferColorAttachment = makeColorMipmapAttachment(this.context, framebufferSize);
      this.framebuffer = new Framebuffer(this.context);
      this.framebuffer.attach(Attachment.Color0, this.framebufferColorAttachment);

      // frame buffer is pixel aligned with layer images.
      // framebuffer view is [ (0,0)-(framebuffer.with, framebuffer.height) ].

      const aspectRatio = framebufferSize.width / framebufferSize.height;
      this.framebufferViewToScreen = makeMatrix4OrthographicSimple(
        framebufferSize.height,
        framebufferSize.clone().multiplyByScalar(0.5),
        0.1,
        3,
        1,
        aspectRatio,
      );
      this.framebufferScreenToView = makeMatrix4Inverse(this.framebufferViewToScreen);
      this.framebufferSize.copy(framebufferSize);
    }
  }

  // have a sizeChanged function (for when the div changes size.)
  updateViewport(): void {
    const canvasFramebuffer = this.context.canvasFramebuffer;
    const viewportSize = canvasFramebuffer.size;
    if (!viewportSize.equals(this.viewportSize)) {
      // console.log(`resizing canvas framebuffer to (${renderSize.x} ${renderSize.y})`);
      const renderAspectRatio = viewportSize.width / viewportSize.height;
      this.viewToScreen = makeMatrix4OrthographicSimple(
        viewportSize.height,
        viewportSize.clone().multiplyByScalar(0.5),
        0.1,
        3,
        1,
        renderAspectRatio,
      );
      this.screenToView = makeMatrix4Inverse(this.viewToScreen);
      this.viewportSize.copy(viewportSize);
    }
  }

  loadTexImage2D(key: string, image: HTMLImageElement | ImageBitmap): Promise<TexImage2D> {
    return new Promise<TexImage2D>((resolve) => {
      // check for texture in cache.
      const cachedTexImage2D = this.texImage2DCache[key];
      if (cachedTexImage2D !== undefined && !cachedTexImage2D.disposed) {
        return resolve(cachedTexImage2D);
      }
      // console.log(image, key);
      // create texture
      const texture = new Texture(image);
      texture.wrapS = TextureWrap.ClampToEdge;
      texture.wrapT = TextureWrap.ClampToEdge;
      texture.minFilter = TextureFilter.Nearest;
      texture.generateMipmaps = false;
      texture.anisotropicLevels = 1;
      texture.name = key;

      // console.log(texture);
      // load texture onto the GPU
      const texImage2D = makeTexImage2DFromTexture(this.context, texture);
      this.texImage2DCache[key] = texImage2D;
      // console.log(texImage2D);
      return resolve(texImage2D);
    });
  }

  // ask how much memory is used
  // set max size
  // draw() - makes things fit with size of div assuming piframebufferToLayerUVScalels are square
  render(): void {
    // framebuffer.clear();
    this.updateViewport();
    this.renderLayersToFramebuffer();

    const layerUVScale = new Vector2(
      this.layerSize.width / this.framebufferSize.width,
      this.layerSize.height / this.framebufferSize.height,
    );

    // shrink to fit within render target
    const fitScale = Math.min(
      this.viewportSize.width / this.layerSize.width,
      this.viewportSize.height / this.layerSize.height,
    );
    const layerToViewportScale = fitScale * this.zoomScale;
    /* if (this.firstRender) {
      console.log("viewportSize", this.viewportSize);
      console.log("layerSize", this.layerSize);
      console.log("fitScale", fitScale);
      console.log("zoomScale", this.zoomScale);
      console.log("layerToViewportScale", layerToViewportScale);
      console.log("layerUVScale", layerUVScale);
    }*/

    const localToWorld = makeMatrix4Scale(new Vector3(this.layerSize.width, this.layerSize.height, 1.0));

    // convert from layer pixel space to view space using zoom and pan
    let worldToView = new Matrix4();
    worldToView = makeMatrix4Concatenation(
      makeMatrix4Translation(new Vector3(this.panPosition.x, this.panPosition.y, 0.0)),
      worldToView,
    );
    worldToView = makeMatrix4Concatenation(
      makeMatrix4Scale(new Vector3(layerToViewportScale, layerToViewportScale, 1.0)),
      worldToView,
    );
    // const worldToView = makeMatrix4Concatenation(worldToViewScale, worldToViewTranslation);

    const canvasFramebuffer = this.context.canvasFramebuffer;
    canvasFramebuffer.clearState = new ClearState(new Vector3(1, 0, 0.5), 1.0);
    canvasFramebuffer.clear();

    const framebufferColorAttachment = this.framebufferColorAttachment;
    if (framebufferColorAttachment === undefined) {
      return;
    }
    const uniforms = {
      screenToView: this.screenToView,
      viewToScreen: this.viewToScreen,
      worldToView: worldToView,
      localToWorld: localToWorld,
      layerMap: framebufferColorAttachment,
      layerUVScale: layerUVScale,
      mipmapBias: 0.25,
    };

    /*
    if (this.firstRender) {
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
    }*/

    // console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
    renderBufferGeometry(canvasFramebuffer, this.#program, uniforms, this.#bufferGeometry, undefined, this.#blendState);
  }

  renderLayersToFramebuffer(): void {
    this.updateFramebuffer();
    const framebuffer = this.framebuffer;
    if (framebuffer === undefined) {
      return;
    }

    // clear to black and full alpha.
    framebuffer.clearState = new ClearState(new Vector3(0, 1, 0.5), 1.0);
    framebuffer.clear();

    this.layers.forEach((layer) => {
      const uniforms = {
        screenToView: this.framebufferScreenToView,
        viewToScreen: this.framebufferViewToScreen,
        worldToView: new Matrix4(),
        localToWorld: layer.localToWorld,
        layerMap: layer.texImage2D,
        layerUVScale: new Vector2(1.0, 1.0),
        mipmapBias: 0,
      };

      /* if (this.firstRender) {
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
        console.log(uniforms);
      }*/

      // console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
      renderBufferGeometry(framebuffer, this.#program, uniforms, this.#bufferGeometry, undefined, this.#blendState);
    });
    // this.firstRender = false;

    // generate mipmaps.
    const colorAttachment = this.framebufferColorAttachment;
    if (colorAttachment !== undefined) {
      colorAttachment.generateMipmaps();
    }
  }
}
