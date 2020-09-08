import { transformGeometry } from "../../geometry/Geometry.Functions";
import { planeGeometry } from "../../geometry/primitives/planeGeometry";
import { Blending } from "../../materials/Blending";
import { ShaderMaterial } from "../../materials/ShaderMaterial";
import { ceilPow2 } from "../../math/Functions";
import { makeMatrix3Scale } from "../../math/Matrix3.Functions";
import { Matrix4 } from "../../math/Matrix4";
import {
  makeMatrix4Concatenation,
  makeMatrix4Inverse,
  makeMatrix4OrthographicSimple,
  makeMatrix4Scale,
  makeMatrix4Translation,
} from "../../math/Matrix4.Functions";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
import { blendModeToBlendState, BlendState } from "../../renderers/webgl/BlendState";
import { BufferGeometry, makeBufferGeometryFromGeometry } from "../../renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../renderers/webgl/ClearState";
import { Attachment } from "../../renderers/webgl/framebuffers/Attachment";
import { Framebuffer } from "../../renderers/webgl/framebuffers/Framebuffer";
import { renderBufferGeometry } from "../../renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial, Program } from "../../renderers/webgl/programs/Program";
import { RenderingContext } from "../../renderers/webgl/RenderingContext";
import { DataType } from "../../renderers/webgl/textures/DataType";
import { PixelFormat } from "../../renderers/webgl/textures/PixelFormat";
import { makeTexImage2DFromTexture, TexImage2D } from "../../renderers/webgl/textures/TexImage2D";
import { TexParameters } from "../../renderers/webgl/textures/TexParameters";
import { TextureFilter } from "../../renderers/webgl/textures/TextureFilter";
import { TextureTarget } from "../../renderers/webgl/textures/TextureTarget";
import { TextureWrap } from "../../renderers/webgl/textures/TextureWrap";
import { fetchImage } from "../../textures/loaders/Image";
import { Texture } from "../../textures/Texture";
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
  texParams.anisotropyLevels = 1;
  texParams.wrapS = TextureWrap.ClampToEdge;
  texParams.wrapT = TextureWrap.ClampToEdge;
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

export class LayerCompositor {
  context: RenderingContext;
  texImage2DCache: TexImage2DMap = {};
  #bufferGeometry: BufferGeometry;
  #program: Program;
  #blendState: BlendState;
  canvasToImage = new Matrix4();
  imageToCanvas = new Matrix4();
  canvasSize = new Vector2();
  imageSize = new Vector2(0, 0);
  zoomScale = 1.0; // no zoom
  panPosition: Vector2 = new Vector2(0.5, 0.5); // center
  layers: Layer[] = [];
  firstRender = true;
  clearState = new ClearState(new Vector3(1, 1, 1), 1.0);
  offscreenFramebuffer: Framebuffer | undefined;
  offscreenSize = new Vector2(0, 0);
  offscreenColorAttachment: TexImage2D | undefined;
  imageToOffscreen = new Matrix4();
  offscreenToImage = new Matrix4();

  constructor(canvas: HTMLCanvasElement) {
    this.context = new RenderingContext(canvas, {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      stencil: false,
    });
    const plane = planeGeometry(1, 1, 1, 1);
    transformGeometry(plane, makeMatrix4Translation(new Vector3(0.5, 0.5, 0.0)));
    this.#bufferGeometry = makeBufferGeometryFromGeometry(this.context, plane);
    this.#program = makeProgramFromShaderMaterial(this.context, new ShaderMaterial(vertexSource, fragmentSource));
    this.#blendState = blendModeToBlendState(Blending.Over, true);

    const that = this;
    this.context.canvas.addEventListener(
      "webglcontextlost",
      function (event) {
        event.preventDefault();
        that.onContextRestored();
      },
      false,
    );
    this.context.canvas.addEventListener(
      "webglcontextrestored",
      function () {
        that.onContextRestored();
      },
      false,
    );
  }

  onContextLost(): void {}
  onContextRestored(): void {
    if (this.offscreenFramebuffer !== undefined) {
      // reload framebuffer
      this.offscreenFramebuffer.dispose();
      this.offscreenFramebuffer = undefined;
      this.updateOffscreen();

      // reload layer textures
      this.layers.forEach((layer) => {
        layer.texImage2D.dispose();
        this.loadTexImage2D(layer.url).then((texImage2D) => {
          layer.texImage2D = texImage2D;
        });
      });
    }
  }

  updateOffscreen(): void {
    // but to enable mipmaps (for filtering) we need it to be up-rounded to a power of 2 in width/height.
    const offscreenSize = new Vector2(ceilPow2(this.imageSize.x), ceilPow2(this.imageSize.y));
    if (this.offscreenFramebuffer === undefined || !this.offscreenSize.equals(offscreenSize)) {
      // console.log("updating framebuffer");

      if (this.offscreenFramebuffer !== undefined) {
        this.offscreenFramebuffer.dispose();
        this.offscreenFramebuffer = undefined;
      }
      this.offscreenColorAttachment = makeColorMipmapAttachment(this.context, offscreenSize);
      this.offscreenFramebuffer = new Framebuffer(this.context);
      this.offscreenFramebuffer.attach(Attachment.Color0, this.offscreenColorAttachment);

      // frame buffer is pixel aligned with layer images.
      // framebuffer view is [ (0,0)-(framebuffer.with, framebuffer.height) ].

      const offscreenAspectRatio = offscreenSize.width / offscreenSize.height;
      this.imageToOffscreen = makeMatrix4OrthographicSimple(
        offscreenSize.height,
        offscreenSize.clone().multiplyByScalar(0.5),
        -1,
        1,
        1,
        offscreenAspectRatio,
      );
      this.offscreenToImage = makeMatrix4Inverse(this.imageToOffscreen);
      this.offscreenSize.copy(offscreenSize);
    }
  }

  // have a sizeChanged function (for when the div changes size.)
  updateCanvas(): void {
    const canvasFramebuffer = this.context.canvasFramebuffer;
    const canvasSize = canvasFramebuffer.size;
    if (!canvasSize.equals(this.canvasSize)) {
      // console.log(`resizing canvas framebuffer to (${renderSize.x} ${renderSize.y})`);
      const canvasAspectRatio = canvasSize.width / canvasSize.height;
      this.imageToCanvas = makeMatrix4OrthographicSimple(
        canvasSize.height,
        canvasSize.clone().multiplyByScalar(0.5),
        -1,
        1,
        1,
        canvasAspectRatio,
      );
      this.canvasToImage = makeMatrix4Inverse(this.imageToCanvas);
      this.canvasSize.copy(canvasSize);
    }
  }

  loadTexImage2D(url: string, image: HTMLImageElement | ImageBitmap | undefined = undefined): Promise<TexImage2D> {
    return new Promise<TexImage2D>((resolve) => {
      // check for texture in cache.
      const cachedTexImage2D = this.texImage2DCache[url];
      if (cachedTexImage2D !== undefined && !cachedTexImage2D.disposed) {
        return resolve(cachedTexImage2D);
      }

      function createTexture(compositor: LayerCompositor, image: HTMLImageElement | ImageBitmap): TexImage2D {
        // console.log(image, key);
        // create texture
        const texture = new Texture(image);
        texture.wrapS = TextureWrap.ClampToEdge;
        texture.wrapT = TextureWrap.ClampToEdge;
        texture.minFilter = TextureFilter.Nearest;
        texture.generateMipmaps = false;
        texture.anisotropicLevels = 1;
        texture.name = url;

        // console.log(texture);
        // load texture onto the GPU
        const texImage2D = makeTexImage2DFromTexture(compositor.context, texture);
        compositor.texImage2DCache[url] = texImage2D;
        // console.log(texImage2D);
        return texImage2D;
      }
      if (image === undefined) {
        fetchImage(url).then((image: HTMLImageElement | ImageBitmap) => {
          return resolve(createTexture(this, image));
        });
      } else if (image instanceof HTMLImageElement || image instanceof ImageBitmap) {
        return resolve(createTexture(this, image));
      }
    });
  }

  // ask how much memory is used
  // set max size
  // draw() - makes things fit with size of div assuming pixels are square
  render(): void {
    // framebuffer.clear();
    this.updateCanvas();
    this.renderLayersToFramebuffer();

    const layerUVScale = new Vector2(
      this.imageSize.width / this.offscreenSize.width,
      this.imageSize.height / this.offscreenSize.height,
    );

    // shrink to fit within render target
    const fitScale = Math.min(
      this.canvasSize.width / this.imageSize.width,
      this.canvasSize.height / this.imageSize.height,
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

    const localToWorld = makeMatrix4Scale(new Vector3(this.imageSize.width, this.imageSize.height, 1.0));

    // convert from layer pixel space to view space using zoom and pan
    let worldToView = new Matrix4();
    worldToView = makeMatrix4Concatenation(
      makeMatrix4Scale(new Vector3(layerToViewportScale, layerToViewportScale, 1.0)),
      worldToView,
    );
    worldToView = makeMatrix4Concatenation(
      makeMatrix4Translation(
        new Vector3(
          this.canvasSize.width * 0.5 - this.imageSize.width * fitScale * 0.5,
          this.canvasSize.height * 0.5 - this.imageSize.height * fitScale * 0.5,
          0.0,
        ),
      ),
      worldToView,
    );
    worldToView = makeMatrix4Concatenation(
      makeMatrix4Translation(new Vector3(this.panPosition.x, this.panPosition.y, 0.0)),
      worldToView,
    );
    // const worldToView = makeMatrix4Concatenation(worldToViewScale, worldToViewTranslation);

    const canvasFramebuffer = this.context.canvasFramebuffer;
    canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0.0), 0.0);
    canvasFramebuffer.clear();

    const offscreenColorAttachment = this.offscreenColorAttachment;
    if (offscreenColorAttachment === undefined) {
      return;
    }
    const uniforms = {
      screenToView: this.canvasToImage,
      viewToScreen: this.imageToCanvas,
      worldToView: worldToView,
      localToWorld: localToWorld,
      layerMap: offscreenColorAttachment,
      uvToTexture: makeMatrix3Scale(layerUVScale),
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
    this.updateOffscreen();
    const offscreenFramebuffer = this.offscreenFramebuffer;
    if (offscreenFramebuffer === undefined) {
      return;
    }

    // clear to black and full alpha.
    offscreenFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 0.0);
    offscreenFramebuffer.clear();

    this.layers.forEach((layer) => {
      const uniforms = {
        screenToView: this.offscreenToImage,
        viewToScreen: this.imageToOffscreen,
        worldToView: new Matrix4(),
        localToWorld: layer.layerToImage,
        layerMap: layer.texImage2D,
        uvToTexture: layer.uvToTexture,
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
      renderBufferGeometry(
        offscreenFramebuffer,
        this.#program,
        uniforms,
        this.#bufferGeometry,
        undefined,
        this.#blendState,
      );
    });
    // this.firstRender = false;

    // generate mipmaps.
    const colorAttachment = this.offscreenColorAttachment;
    if (colorAttachment !== undefined) {
      colorAttachment.generateMipmaps();
    }
  }
}
