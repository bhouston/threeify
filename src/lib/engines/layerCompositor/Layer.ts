import {
  makeMat3Concatenation,
  scale2ToMat3,
  translation2ToMat3
} from '../../math/Mat3.Functions.js';
import { Mat3 } from '../../math/Mat3.js';
import {
  mat4Multiply,
  scale3ToMat4,
  translation3ToMat4
} from '../../math/Mat4.Functions.js';
import { Mat4 } from '../../math/Mat4.js';
import { Vec2 } from '../../math/Vec2.js';
import { Vec3 } from '../../math/Vec3.js';
import { TexImage2D } from '../../renderers/webgl/textures/TexImage2D.js';
import { LayerCompositor } from './LayerCompositor.js';

export class Layer {
  disposed = false;
  planeToImage: Mat4;
  uvToTexture: Mat3;

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
      new Vec3(this.texImage2D.size.width, this.texImage2D.size.height, 1)
    );
    const layerToImage = translation3ToMat4(
      new Vec3(this.offset.x, this.offset.y, 0)
    );
    this.planeToImage = mat4Multiply(layerToImage, planeToLayer);

    const uvScale = scale2ToMat3(this.uvScaleFactor);
    const uvTranslation = translation2ToMat3(this.uvOffset);
    this.uvToTexture = makeMat3Concatenation(uvTranslation, uvScale);
  }
}
