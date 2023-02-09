import {
  Attachment,
  BufferGeometry,
  ClearState,
  DataType,
  fetchImage,
  Framebuffer,
  IDisposable,
  isImageBitmapSupported,
  isiOS,
  isMacOS,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  PixelFormat,
  planeGeometry,
  Program,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  TexParameters,
  Texture,
  TextureFilter,
  TextureTarget,
  TextureWrap,
  transformGeometry,
  UniformValueMap
} from '@threeify/core';
import {
  ceilPow2,
  Color3,
  mat4Orthographic,
  mat4OrthographicSimple,
  scale3ToMat4,
  translation3ToMat4,
  Vec2,
  vec2Add,
  vec2Equals,
  vec2MultiplyByScalar,
  vec2Subtract,
  Vec3
} from '@threeify/vector-math';

import fragmentSource from './fragment.glsl';
import { copySourceBlendState, Layer } from './Layer';
import { viewToMat3LayerUv } from './makeMatrix3FromViewToLayerUv';
import vertexSource from './vertex.glsl';

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
    public image: ImageBitmap | HTMLImageElement | undefined
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
export type TexImage2DPromiseMap = {
  [key: string]: Promise<TexImage2D> | undefined;
};

export function makeColorMipmapAttachment(
  context: RenderingContext,
  size: Vec2,
  dataType: DataType | undefined = undefined,
  options: {
    wrapS?: TextureWrap;
    wrapT?: TextureWrap;
  } = {}
): TexImage2D {
  const texParams = new TexParameters();
  texParams.generateMipmaps = true;
  texParams.anisotropyLevels = 1;
  texParams.wrapS = options.wrapS ?? TextureWrap.ClampToEdge;
  texParams.wrapT = options.wrapT ?? TextureWrap.ClampToEdge;
  texParams.magFilter = TextureFilter.Linear;
  texParams.minFilter = TextureFilter.LinearMipmapLinear;
  return new TexImage2D(
    context,
    [size],
    PixelFormat.RGBA,
    dataType ?? DataType.UnsignedByte,
    PixelFormat.RGBA,
    TextureTarget.Texture2D,
    texParams
  );
}

export enum ImageFitMode {
  FitWidth,
  FitHeight
}

export class LayerCompositor {
  context: RenderingContext;
  layerImageCache: LayerImageMap = {};
  texImage2DPromiseCache: TexImage2DPromiseMap = {};
  #bufferGeometry: BufferGeometry;
  #program: Program;
  imageSize = new Vec2(0, 0);
  imageFitMode: ImageFitMode = ImageFitMode.FitHeight;
  zoomScale = 1; // no zoom
  panPosition: Vec2 = new Vec2(0.5, 0.5); // center
  #layers: Layer[] = [];
  #layerVersion = 0;
  #offlineLayerVersion = -1;
  firstRender = true;
  clearState = new ClearState(Color3.White, 0);
  offscreenSize = new Vec2(0, 0);
  offscreenWriteFramebuffer: Framebuffer | undefined;
  offscreenWriteColorAttachment: TexImage2D | undefined;
  offscreenReadFramebuffer: Framebuffer | undefined;
  offscreenReadColorAttachment: TexImage2D | undefined;
  renderId = 0;
  autoDiscard = false;

  constructor(canvas: HTMLCanvasElement) {
    this.context = new RenderingContext(canvas, {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      stencil: false,
      preserveDrawingBuffer: true
    });
    this.context.canvasFramebuffer.devicePixelRatio = window.devicePixelRatio;
    this.context.canvasFramebuffer.resize();
    const plane = planeGeometry(1, 1, 1, 1);
    transformGeometry(plane, translation3ToMat4(new Vec3(0.5, 0.5, 0)));
    this.#bufferGeometry = makeBufferGeometryFromGeometry(this.context, plane);
    this.#program = makeProgramFromShaderMaterial(
      this.context,
      new ShaderMaterial('layerComposite', vertexSource, fragmentSource)
    );
  }

  snapshot(mimeFormat = 'image/jpeg', quality = 1): string {
    const canvas = this.context.canvasFramebuffer.canvas;
    if (canvas instanceof HTMLCanvasElement) {
      return canvas.toDataURL(mimeFormat, quality);
    }
    throw new Error('snapshot not supported');
  }
  set layers(layers: Layer[]) {
    this.#layers = layers;
    this.#layerVersion++;
  }
  updateOffscreen(): void {
    // but to enable mipmaps (for filtering) we need it to be up-rounded to a power of 2 in width/height.
    const offscreenSize = new Vec2(
      ceilPow2(this.imageSize.x),
      ceilPow2(this.imageSize.y)
    );
    if (
      this.offscreenWriteFramebuffer === undefined ||
      this.offscreenReadFramebuffer === undefined ||
      !vec2Equals(this.offscreenSize, offscreenSize)
    ) {
      this.offscreenSize.copy(offscreenSize);
      // console.log("updating framebuffer");

      if (this.offscreenWriteFramebuffer !== undefined) {
        this.offscreenWriteFramebuffer.dispose();
        this.offscreenWriteFramebuffer = undefined;
      }

      this.offscreenWriteColorAttachment = this.makeColorMipmapAttachment();
      this.offscreenWriteFramebuffer = new Framebuffer(this.context);
      this.offscreenWriteFramebuffer.attach(
        Attachment.Color0,
        this.offscreenWriteColorAttachment
      );

      if (this.offscreenReadFramebuffer !== undefined) {
        this.offscreenReadFramebuffer.dispose();
        this.offscreenReadFramebuffer = undefined;
      }

      this.offscreenReadColorAttachment = this.makeColorMipmapAttachment();
      this.offscreenReadFramebuffer = new Framebuffer(this.context);
      this.offscreenReadFramebuffer.attach(
        Attachment.Color0,
        this.offscreenReadColorAttachment
      );

      // frame buffer is pixel aligned with layer images.
      // framebuffer view is [ (0,0)-(framebuffer.with, framebuffer.height) ].
    }
  }
  makeColorMipmapAttachment() {
    return makeColorMipmapAttachment(this.context, this.offscreenSize);
  }

  loadTexImage2D(
    url: string,
    image: HTMLImageElement | ImageBitmap | undefined = undefined
  ): Promise<TexImage2D> {
    const layerImagePromise = this.texImage2DPromiseCache[url];
    if (layerImagePromise !== undefined) {
      // console.log(`loading: ${url} (reusing promise)`);
      return layerImagePromise;
    }

    return (this.texImage2DPromiseCache[url] = new Promise<TexImage2D>(
      (resolve) => {
        // check for texture in cache.
        const layerImage = this.layerImageCache[url];
        if (layerImage !== undefined) {
          return resolve(layerImage.texImage2D);
        }

        function createTexture(
          compositor: LayerCompositor,
          image: HTMLImageElement | ImageBitmap
        ): TexImage2D {
          // console.log(image, key);

          // create texture
          const texture = new Texture(image);
          texture.wrapS = TextureWrap.ClampToEdge;
          texture.wrapT = TextureWrap.ClampToEdge;
          texture.minFilter = TextureFilter.Nearest;
          texture.generateMipmaps = false;
          texture.anisotropicLevels = 1;
          texture.name = url;

          // console.log(`loading: ${url}`);
          // load texture onto the GPU
          const texImage2D = makeTexImage2DFromTexture(
            compositor.context,
            texture
          );
          delete compositor.texImage2DPromiseCache[url];
          return (compositor.layerImageCache[url] = new LayerImage(
            url,
            texImage2D,
            image
          )).texImage2D;
        }

        if (image === undefined) {
          // eslint-disable-next-line promise/catch-or-return
          fetchImage(url).then((image: HTMLImageElement | ImageBitmap) => {
            return resolve(createTexture(this, image));
          });
        } else if (
          image instanceof HTMLImageElement ||
          image instanceof ImageBitmap
        ) {
          return resolve(createTexture(this, image));
        }
      }
    )).then((texImage2D) => {
      delete this.texImage2DPromiseCache[url];
      return texImage2D;
    });
  }

  discardTexImage2D(url: string): boolean {
    // check for texture in cache.
    const layerImage = this.layerImageCache[url];
    if (layerImage !== undefined) {
      // console.log(`discarding: ${url}`);
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

    this.renderLayersToFramebuffer();

    const offscreenColorAttachment = this.offscreenWriteColorAttachment;
    if (offscreenColorAttachment === undefined) {
      return;
    }

    const canvasFramebuffer = this.context.canvasFramebuffer;
    const canvasSize = canvasFramebuffer.size;
    const canvasAspectRatio = canvasSize.x / canvasSize.y;

    const imageToCanvasScale =
      this.imageFitMode === ImageFitMode.FitWidth
        ? canvasSize.x / this.imageSize.x
        : canvasSize.y / this.imageSize.y;

    const canvasImageSize = vec2MultiplyByScalar(
      this.imageSize,
      imageToCanvasScale
    );
    const canvasImageCenter = vec2MultiplyByScalar(canvasImageSize, 0.5);

    if (this.zoomScale > 1) {
      // convert from canvas space to image space
      const imagePanPosition = vec2MultiplyByScalar(
        this.panPosition,
        (1 / imageToCanvasScale) *
          this.context.canvasFramebuffer.devicePixelRatio
      );
      const imageCanvasSize = vec2MultiplyByScalar(
        canvasSize,
        1 / imageToCanvasScale
      );

      // center pan
      const imagePanOffset = vec2Subtract(
        imagePanPosition,
        vec2MultiplyByScalar(imageCanvasSize, 0.5)
      );
      // clamp to within image.
      imagePanOffset.x =
        Math.sign(imagePanOffset.x) *
        Math.min(Math.abs(imagePanOffset.x), this.imageSize.x * 0.5);
      imagePanOffset.y =
        Math.sign(imagePanOffset.y) *
        Math.min(Math.abs(imagePanOffset.y), this.imageSize.y * 0.5);

      // convert back to
      const canvasPanOffset = vec2MultiplyByScalar(
        imagePanOffset,
        imageToCanvasScale
      );

      // ensure zoom is at point of contact, not center of screen.
      const centeredCanvasPanOffset = vec2MultiplyByScalar(
        canvasPanOffset,
        1 - 1 / this.zoomScale
      );

      vec2Add(canvasImageCenter, centeredCanvasPanOffset, canvasImageCenter);
    }

    const imageToCanvas = mat4OrthographicSimple(
      canvasSize.y,
      canvasImageCenter,
      -1,
      1,
      this.zoomScale,
      canvasAspectRatio
    );
    /* console.log(
      `Canvas Camera: height ( ${canvasSize.height} ), center ( ${scaledImageCenter.x}, ${scaledImageCenter.y} ) `,
    );*/

    const planeToImage = scale3ToMat4(
      new Vec3(canvasImageSize.x, canvasImageSize.y, 1)
    );

    const offscreenScaledSize = vec2MultiplyByScalar(
      this.offscreenSize,
      imageToCanvasScale
    );
    const viewToLayerUv = viewToMat3LayerUv(
      offscreenScaledSize,
      undefined,
      true
    );

    canvasFramebuffer.clearState = new ClearState(Color3.Black, 0);
    canvasFramebuffer.clear();

    const uniforms: UniformValueMap = {
      localToView: planeToImage,
      viewToScreen: imageToCanvas,

      mipmapBias: 0,
      convertToPremultipliedAlpha: 0,

      layerMap: offscreenColorAttachment!,
      viewToLayerUv,

      maskMode: 0,
      blendMode: 0
    };

    //console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program: this.#program,
      uniforms,
      bufferGeometry: this.#bufferGeometry,
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

  renderLayersToFramebuffer(): void {
    this.updateOffscreen();

    if (this.#offlineLayerVersion >= this.#layerVersion) {
      return;
    }
    this.#offlineLayerVersion = this.#layerVersion;

    const offscreenWriteFramebuffer = this.offscreenWriteFramebuffer;
    const offscreenReadFramebuffer = this.offscreenReadFramebuffer;
    if (
      offscreenWriteFramebuffer === undefined ||
      offscreenReadFramebuffer === undefined
    ) {
      return;
    }

    // clear to black and full alpha.
    offscreenWriteFramebuffer.clearState = new ClearState(Color3.Black, 0);
    offscreenWriteFramebuffer.clear();

    offscreenReadFramebuffer.clearState = new ClearState(Color3.Black, 0);
    offscreenReadFramebuffer.clear();

    const imageToOffscreen = mat4Orthographic(
      0,
      this.offscreenSize.x,
      0,
      this.offscreenSize.y,
      -1,
      1
    );
    /* console.log(
      `Canvas Camera: height ( ${this.offscreenSize.height} ), center ( ${offscreenCenter.x}, ${offscreenCenter.y} ) `,
    );*/

    // Ben on 2020-10-31
    // - does not understand why this is necessary.
    // - this means it may be working around a bug, and thus this will break in the future.
    // - the bug would be in chrome as it seems to be the inverse of the current query
    // Antoine on 2022-04-08
    // - Firefox now also sends premultiplied textures to the shader, which seems to indicate the problem rests with the IOS/Mac implementation
    const convertToPremultipliedAlpha = isMacOS() || isiOS() ? 1 : 0;

    // const offscreenLocalToView = makeMat4Scale(new Vec3(this.offscreenSize.x, this.offscreenSize.y, 1.0));
    const viewToImageUv = viewToMat3LayerUv(
      this.offscreenSize,
      undefined,
      true
    );

    this.#layers.forEach((layer, idx) => {
      const layerImage = this.layerImageCache[layer.url];
      if (layerImage !== undefined) {
        layerImage.renderId = this.renderId;
      }

      const mask = layer.mask;
      const maskImage = mask && this.layerImageCache[mask.url];
      if (maskImage !== undefined) {
        maskImage.renderId = this.renderId;
      }

      // Can't be accomplished with blendState alone, so we need to copy a section of the writeBuffer to the read buffer
      if (!layer.isTriviallyBlended) {
        const uniforms: UniformValueMap = {
          // Only copies the section the layer needs for compositing
          localToView: layer.planeToImage,
          viewToScreen: imageToOffscreen,

          mipmapBias: 0,
          convertToPremultipliedAlpha: 0,

          imageMap: this.offscreenWriteColorAttachment!, // Not used, but avoids framebuffer loop
          viewToImageUv,

          layerMap: this.offscreenWriteColorAttachment!,
          viewToLayerUv: viewToImageUv,

          maskMode: 0,
          blendMode: 0
        };

        renderBufferGeometry({
          framebuffer: this.offscreenReadFramebuffer!,
          program: this.#program,
          uniforms,
          bufferGeometry: this.#bufferGeometry,
          blendState: copySourceBlendState
        });
      }

      // Layering
      {
        let uniforms: UniformValueMap = {
          localToView: layer.planeToImage,
          viewToScreen: imageToOffscreen,

          mipmapBias: 0,
          convertToPremultipliedAlpha,

          imageMap: this.offscreenReadColorAttachment!,
          viewToImageUv,

          layerMap: layer.texImage2D,
          viewToLayerUv: layer.viewToLayerUv,

          maskMode: 0,
          blendMode: layer.blendModeUniformValue
        };

        if (mask) {
          uniforms = {
            ...uniforms,
            maskMode: mask.mode,
            maskMap: mask.texImage2D,
            viewToMaskUv: mask.viewToLayerUv
          };
        }

        // console.log(`drawing layer #${index}: ${layer.url} at ${layer.offset.x}, ${layer.offset.y}`);
        renderBufferGeometry({
          framebuffer: this.offscreenWriteFramebuffer!,
          program: this.#program,
          uniforms,
          bufferGeometry: this.#bufferGeometry,
          blendState: layer.blendModeBlendState
        });
      }
    });

    this.offscreenWriteColorAttachment!.generateMipmaps();
  }
}
