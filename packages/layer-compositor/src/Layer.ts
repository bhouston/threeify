import { BlendFunc, BlendState, TexImage2D } from '@threeify/core';
import {
  Mat3,
  Mat4,
  mat4Multiply,
  scale3ToMat4,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/math';

import { LayerCompositor } from './LayerCompositor';
import { viewToMat3LayerUv } from './makeMatrix3FromViewToLayerUv';

class LayerTexture {
  disposed = false;
  planeToImage: Mat4;
  viewToLayerUv: Mat3;

  public get size(): Vec2 {
    return this.texImage2D.size;
  }

  constructor(
    public compositor: LayerCompositor,
    public url: string,
    public texImage2D: TexImage2D,
    public offset: Vec2,
    public uvScaleFactor = new Vec2(1, -1),
    public uvOffset = new Vec2(0, 1)
  ) {
    // console.log(`Layer: size ( ${texImage2D.size.x}, ${texImage2D.size.y} ) `);

    // world space is assumed to be in layer pixel space
    const planeToLayer = scale3ToMat4(
      new Vec3(this.texImage2D.size.x, this.texImage2D.size.y, 1)
    );
    const layerToImage = translation3ToMat4(
      new Vec3(this.offset.x, this.offset.y, 0)
    );
    this.planeToImage = mat4Multiply(layerToImage, planeToLayer);

    this.viewToLayerUv = viewToMat3LayerUv(this.size, this.offset, false);
  }
}

export enum LayerMaskMode {
  None = 0,
  Alpha = 1,
  Luminance = 2,
  InverseAlpha = 3,
  InverseLuminance = 4
}

export enum LayerBlendMode {
  Clear = 0,
  Src = 1,
  Dst = 2,
  SrcOver = 3,
  DstOver = 4,
  SrcIn = 5,
  DstIn = 6,
  SrcOut = 7,
  DstOut = 8,
  SrcAtop = 9,
  DstAtop = 10,
  Xor = 11,
  Add = 12,
  Multiply = 13,
  Screen = 14,
  Overlay = 15,
  Lighten = 16,
  Darken = 17,
  // Available in canvases, but not implemented.
  // Dodge = 18,
  // Burn = 19,
  // HardLight = 20,
  // SoftLight = 21,
  // Difference = 22,
  // Exclusion = 23,
  Hue = 24,
  Saturation = 25,
  Color = 26,
  Luminosity = 27
}

const {
  Zero,
  One,
  SourceAlpha: SA,
  DestAlpha: DA,
  OneMinusSourceAlpha: InvSA,
  OneMinusDestAlpha: InvDA
} = BlendFunc;
const layerBlendModeBlendState: { [mode in LayerBlendMode]?: BlendState } = {
  [LayerBlendMode.Clear]: new BlendState(Zero, Zero, Zero, Zero),
  [LayerBlendMode.Src]: new BlendState(One, Zero, One, Zero),
  [LayerBlendMode.Dst]: new BlendState(Zero, One, Zero, One),
  [LayerBlendMode.SrcOver]: new BlendState(One, InvSA, One, InvSA),
  [LayerBlendMode.DstOver]: new BlendState(InvDA, One, InvDA, One),
  [LayerBlendMode.SrcIn]: new BlendState(DA, Zero, DA, Zero),
  [LayerBlendMode.DstIn]: new BlendState(Zero, SA, Zero, SA),
  [LayerBlendMode.SrcOut]: new BlendState(InvDA, Zero, InvDA, Zero),
  [LayerBlendMode.DstOut]: new BlendState(Zero, InvSA, Zero, InvSA),
  [LayerBlendMode.SrcAtop]: new BlendState(DA, InvSA, Zero, One),
  [LayerBlendMode.DstAtop]: new BlendState(InvDA, SA, One, Zero),
  [LayerBlendMode.Xor]: new BlendState(InvDA, InvSA, InvDA, InvSA),
  [LayerBlendMode.Add]: new BlendState(One, One, One, One)
};

export const copySourceBlendState =
  layerBlendModeBlendState[LayerBlendMode.Src]!;

export class LayerMask extends LayerTexture {
  constructor(
    compositor: LayerCompositor,
    url: string,
    texImage2D: TexImage2D,
    offset: Vec2,
    public mode: LayerMaskMode = LayerMaskMode.Luminance,
    uvScaleFactor = new Vec2(1, -1),
    uvOffset = new Vec2(0, 1)
  ) {
    super(compositor, url, texImage2D, offset, uvScaleFactor, uvOffset);
  }
}

export class Layer extends LayerTexture {
  constructor(
    compositor: LayerCompositor,
    url: string,
    texImage2D: TexImage2D,
    offset: Vec2,
    public mask?: LayerMask,
    public blendMode: LayerBlendMode = LayerBlendMode.SrcOver,
    uvScaleFactor = new Vec2(1, -1),
    uvOffset = new Vec2(0, 1)
  ) {
    super(compositor, url, texImage2D, offset, uvScaleFactor, uvOffset);
  }

  public get isTriviallyBlended(): boolean {
    return layerBlendModeBlendState[this.blendMode] != null;
  }

  public get blendModeUniformValue(): number {
    return this.isTriviallyBlended ? 0 : this.blendMode;
  }

  public get blendModeBlendState(): BlendState {
    return layerBlendModeBlendState[this.blendMode] ?? copySourceBlendState;
  }
}
