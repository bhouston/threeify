import { IDisposable } from "../../core/types";
import { transformGeometry } from "../../geometry/Geometry.Functions";
import { planeGeometry } from "../../geometry/primitives/planeGeometry";
import { Blending } from "../../materials/Blending";
import { ShaderMaterial } from "../../materials/ShaderMaterial";
import { ceilPow2 } from "../../math/Functions";
import { makeMatrix3Concatenation, makeMatrix3Scale, makeMatrix3Translation } from "../../math/Matrix3.Functions";
import { Matrix4 } from "../../math/Matrix4";
import {
  makeMatrix4Inverse,
  makeMatrix4Orthographic,
  makeMatrix4OrthographicSimple,
  makeMatrix4Scale,
  makeMatrix4Translation,
} from "../../math/Matrix4.Functions";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
import { isFirefox, isiOS, isMacOS } from "../../platform/Detection";
import { UniformValueMap } from "../../renderers";
import { blendModeToBlendState } from "../../renderers/webgl/BlendState";
import { BufferGeometry, makeBufferGeometryFromGeometry } from "../../renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../renderers/webgl/ClearState";
import { Attachment } from "../../renderers/webgl/framebuffers/Attachment";
import { Framebuffer } from "../../renderers/webgl/framebuffers/Framebuffer";
import { renderBufferGeometry } from "../../renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial, Program } from "../../renderers/webgl/programs/Program";
import { RenderingContext } from "../../renderers/webgl/RenderingContext";
import { DataType } from "../../renderers/webgl/textures/DataType";
import { PixelFormat } from "../../renderers/webgl/textures/PixelFormat";
import { TexImage2D } from "../../renderers/webgl/textures/TexImage2D";
import { makeTexImage2DFromTexture } from "../../renderers/webgl/textures/TexImage2D.Functions";
import { TexParameters } from "../../renderers/webgl/textures/TexParameters";
import { TextureFilter } from "../../renderers/webgl/textures/TextureFilter";
import { TextureTarget } from "../../renderers/webgl/textures/TextureTarget";
import { TextureWrap } from "../../renderers/webgl/textures/TextureWrap";
import { fetchImage, isImageBitmapSupported } from "../../textures/loaders/Image";
import { Texture } from "../../textures/Texture";
import fragmentSource from "./fragment.glsl";
import { Layer } from "./Layer";
import vertexSource from "./vertex.glsl";

function releaseImage(image: ImageBitmap | HTMLImageElement | undefined): void {
  if (isImageBitmapSupported() && image instanceof ImageBitmap) {
    image.close();
  }
  // if HTMLImageElement do nothing, just ensure there are no references to it.
}
export class LayerImage implements IDisposable {
  disposed = false;
  renderId = -1;

  constructor(
    readonly url: string,
    public texImage2D: TexImage2D,
    public image: ImageBitmap | HTMLImageElement | undefined,
  ) {
    // console.log(`layerImage.load: ${this.url}`);
  }

  dispose(): void {
    if (!this.disposed) {
      this.texImage2D.dispose();
      releaseImage(this.image);
      this.image = undefined;
      this.disposed = true;
      // console.log(`layerImage.dispose: ${this.url}`);
    }
  }
}

export type LayerImageMap = { [key: string]: LayerImage | undefined };
export type TexImage2DPromiseMap = { [key: string]: Promise<TexImage2D> | undefined };

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

export enum ImageFitMode {
  FitWidth,
  FitHeight,
}

export class LayerCompositor {
  context: RenderingContext;
  layerImageCache: LayerImageMap = {};
  texImage2DPromiseCache: TexImage2DPromiseMap = {};
  #bufferGeometry: BufferGeometry;
  #program: Program;
  imageSize = new Vector2(0, 0);
  imageFitMode: ImageFitMode = ImageFitMode.FitHeight;
  zoomScale = 1.0; // no zoom
  panPosition: Vector2 = new Vector2(0.5, 0.5); // center
  #layers: Layer[] = [];
  #layerVersion = 0;
  #offlineLayerVersion = -1;
  firstRender = true;
  clearState = new ClearState(new Vector3(1, 1, 1), 0.0);
  offscreenFramebuffer: Framebuffer | undefined;
  offscreenSize = new Vector2(0, 0);
  offscreenColorAttachment: TexImage2D | undefined;
  renderId = 0;
  autoDiscard = false;

  constructor(canvas: HTMLCanvasElement) {
    this.context = new RenderingContext(canvas, {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      stencil: false,
      preserveDrawingBuffer: true,
    });
    this.context.canvasFramebuffer.devicePixelRatio = window.devicePixelRatio;
    this.context.canvasFramebuffer.resize();
    const plane = planeGeometry(1, 1, 1, 1);
    transformGeometry(plane, makeMatrix4Translation(new Vector3(0.5, 0.5, 0.0)));
    this.#bufferGeometry = makeBufferGeometryFromGeometry(this.context, plane);
    this.#program = makeProgramFromShaderMaterial(this.context, new ShaderMaterial(vertexSource, fragmentSource));
  }

  snapshot(mimeFormat = "image/jpeg", quality = 1.0): string {
    const canvas = this.context.canvasFramebuffer.canvas;
    if (canvas instanceof HTMLCanvasElement) {
      return canvas.toDataURL(mimeFormat, quality);
    }
    throw new Error("snapshot not supported");
  }
  set layers(layers: Layer[]) {
    this.#layers = layers;
    this.#layerVersion++;
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

      this.offscreenSize.copy(offscreenSize);
    }
  }

  loadTexImage2D(url: string, image: HTMLImageElement | ImageBitmap | undefined = undefined): Promise<TexImage2D> {
    const layerImagePromise = this.texImage2DPromiseCache[url];
    if (layerImagePromise !== undefined) {
      console.log(`loading: ${url} (reusing promise)`);
      return layerImagePromise;
    }

    return (this.texImage2DPromiseCache[url] = new Promise<TexImage2D>((resolve) => {
      // check for texture in cache.
      const layerImage = this.layerImageCache[url];
      if (layerImage !== undefined) {
        return resolve(layerImage.texImage2D);
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

        console.log(`loading: ${url}`);
        // load texture onto the GPU
        const texImage2D = makeTexImage2DFromTexture(compositor.context, texture);
        delete compositor.texImage2DPromiseCache[url];
        return (compositor.layerImageCache[url] = new LayerImage(url, texImage2D, image)).texImage2D;
      }

      if (image === undefined) {
        fetchImage(url).then((image: HTMLImageElement | ImageBitmap) => {
          return resolve(createTexture(this, image));
        });
      } else if (image instanceof HTMLImageElement || image instanceof ImageBitmap) {
        return resolve(createTexture(this, image));
      }
    })).then((texImage2D) => {
      delete this.texImage2DPromiseCache[url];
      return texImage2D;
    });
  }

  discardTexImage2D(url: string): boolean {
    // check for texture in cache.
    const layerImage = this.layerImageCache[url];
    if (layerImage !== undefined) {
      console.log(`discarding: ${url}`);
      layerImage.dispose();
      delete this.layerImageCache[url];
      return true;
    }
    return false;
  }

  // ask how much memory is used
  // set max size
  // draw() - makes things fit with size of div assuming pixels are square
  render(): void {
    this.renderId++;
    // console.log(`render id: ${this.renderId}`);

    const canvasFramebuffer = this.context.canvasFramebuffer;
    const canvasSize = canvasFramebuffer.size;
    const canvasAspectRatio = canvasSize.width / canvasSize.height;

    const imageToCanvasScale =
      this.imageFitMode === ImageFitMode.FitWidth
        ? canvasSize.width / this.imageSize.width
        : canvasSize.height / this.imageSize.height;

    const canvasImageSize = this.imageSize.clone().multiplyByScalar(imageToCanvasScale);
    const canvasImageCenter = canvasImageSize.clone().multiplyByScalar(0.5);

    if (this.zoomScale > 1.0) {
      // convert from canvas space to image space
      const imagePanPosition = this.panPosition
        .clone()
        .multiplyByScalar(1 / imageToCanvasScale)
        .multiplyByScalar(this.context.canvasFramebuffer.devicePixelRatio);
      const imageCanvasSize = canvasSize.clone().multiplyByScalar(1 / imageToCanvasScale);

      // center pan
      const imagePanOffset = imagePanPosition.clone().sub(imageCanvasSize.clone().multiplyByScalar(0.5));
      // clamp to within image.
      imagePanOffset.x = Math.sign(imagePanOffset.x) * Math.min(Math.abs(imagePanOffset.x), this.imageSize.x * 0.5);
      imagePanOffset.y = Math.sign(imagePanOffset.y) * Math.min(Math.abs(imagePanOffset.y), this.imageSize.y * 0.5);

      // convert back to
      const canvasPanOffset = imagePanOffset.clone().multiplyByScalar(imageToCanvasScale);

      // ensure zoom is at point of contact, not center of screen.
      const centeredCanvasPanOffset = canvasPanOffset.clone().multiplyByScalar(1 - 1 / this.zoomScale);

      canvasImageCenter.add(centeredCanvasPanOffset);
    }

    const imageToCanvas = makeMatrix4OrthographicSimple(
      canvasSize.height,
      canvasImageCenter,
      -1,
      1,
      this.zoomScale,
      canvasAspectRatio,
    );
    /* console.log(
      `Canvas Camera: height ( ${canvasSize.height} ), center ( ${scaledImageCenter.x}, ${scaledImageCenter.y} ) `,
    );*/

    const canvasToImage = makeMatrix4Inverse(imageToCanvas);

    const planeToImage = makeMatrix4Scale(new Vector3(canvasImageSize.width, canvasImageSize.height, 1.0));

    this.renderLayersToFramebuffer();

    const layerUVScale = new Vector2(
      this.imageSize.width / this.offscreenSize.width,
      this.imageSize.height / this.offscreenSize.height,
    );

    const uvScale = makeMatrix3Scale(layerUVScale);
    const uvTranslation = makeMatrix3Translation(
      new Vector2(0, (this.offscreenSize.height - this.imageSize.height) / this.offscreenSize.height),
    );
    const uvToTexture = makeMatrix3Concatenation(uvTranslation, uvScale);

    canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 0.0);
    canvasFramebuffer.clear();

    const offscreenColorAttachment = this.offscreenColorAttachment;
    if (offscreenColorAttachment === undefined) {
      return;
    }
    const uniforms = {
      viewToScreen: imageToCanvas,
      screenToView: canvasToImage,
      worldToView: new Matrix4(),
      localToWorld: planeToImage,
      layerMap: offscreenColorAttachment,
      uvToTexture: uvToTexture,
      maskMode: 0,
      mipmapBias: 0.0,
      convertToPremultipliedAlpha: 0,
    };

    const blendState = blendModeToBlendState(Blending.Over, true);

    // console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
    renderBufferGeometry(canvasFramebuffer, this.#program, uniforms, this.#bufferGeometry, undefined, blendState);

    if (this.autoDiscard) {
      for (const url in this.layerImageCache) {
        const layerImage = this.layerImageCache[url];
        if (layerImage !== undefined && layerImage.renderId < this.renderId) {
          this.discardTexImage2D(url);
        }
      }
    }
  }

  renderLayersToFramebuffer(): void {
    this.updateOffscreen();

    if (this.#offlineLayerVersion >= this.#layerVersion) {
      return;
    }
    this.#offlineLayerVersion = this.#layerVersion;

    const offscreenFramebuffer = this.offscreenFramebuffer;
    if (offscreenFramebuffer === undefined) {
      return;
    }

    // clear to black and full alpha.
    offscreenFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 0.0);
    offscreenFramebuffer.clear();

    const imageToOffscreen = makeMatrix4Orthographic(0, this.offscreenSize.width, 0, this.offscreenSize.height, -1, 1);
    /* console.log(
      `Canvas Camera: height ( ${this.offscreenSize.height} ), center ( ${offscreenCenter.x}, ${offscreenCenter.y} ) `,
    );*/
    const offscreenToImage = makeMatrix4Inverse(imageToOffscreen);

    // Ben on 2020-10-31
    // - does not understand why this is necessary.
    // - this means it may be working around a bug, and thus this will break in the future.
    // - the bug would be in chrome as it seems to be the inverse of the current query
    const convertToPremultipliedAlpha = !(isMacOS() || isiOS() || isFirefox()) ? 0 : 1;

    this.#layers.forEach((layer) => {
      const layerImage = this.layerImageCache[layer.url];
      if (layerImage !== undefined) {
        layerImage.renderId = this.renderId;
      }

      const mask = layer.mask;
      const maskImage = mask && this.layerImageCache[mask.url];
      if (maskImage !== undefined) {
        maskImage.renderId = this.renderId;
      }

      const uniforms: UniformValueMap = {
        viewToScreen: imageToOffscreen,
        screenToView: offscreenToImage,
        worldToView: new Matrix4(),
        localToWorld: layer.planeToImage,
        layerMap: layer.texImage2D,
        uvToTexture: layer.uvToTexture,
        maskMode: 0,
        mipmapBias: 0,
        convertToPremultipliedAlpha,
      };

      if (mask) {
        uniforms.maskMap = mask.texImage2D;
        uniforms.uvToMaskTexture = mask.uvToTexture;
        uniforms.maskMode = mask.mode;
      }

      const blendState = blendModeToBlendState(Blending.Over, true);

      // console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
      renderBufferGeometry(offscreenFramebuffer, this.#program, uniforms, this.#bufferGeometry, undefined, blendState);
    });

    // generate mipmaps.
    const colorAttachment = this.offscreenColorAttachment;
    if (colorAttachment !== undefined) {
      colorAttachment.generateMipmaps();
    }
  }
}
