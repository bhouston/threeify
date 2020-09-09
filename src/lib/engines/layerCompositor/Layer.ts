import { Matrix3 } from "../../math/Matrix3";
import { makeMatrix3Concatenation, makeMatrix3Scale, makeMatrix3Translation } from "../../math/Matrix3.Functions";
import { Matrix4 } from "../../math/Matrix4";
import { makeMatrix4Concatenation, makeMatrix4Scale, makeMatrix4Translation } from "../../math/Matrix4.Functions";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
import { TexImage2D } from "../../renderers/webgl/textures/TexImage2D";
import { LayerCompositor } from "./LayerCompositor";

export class Layer {
  disposed = false;
  planeToImage: Matrix4;
  uvToTexture: Matrix3;

  constructor(
    public compositor: LayerCompositor,
    public url: string,
    public texImage2D: TexImage2D,
    public offset: Vector2,
    public uvScaleFactor = new Vector2(1, -1),
    public uvOffset = new Vector2(0, 1),
    public premultipliedAlpha = true,
  ) {
    // console.log(`Layer: size ( ${texImage2D.size.x}, ${texImage2D.size.y} ) `);

    // world space is assumed to be in layer pixel space
    const planeToLayer = makeMatrix4Scale(new Vector3(this.texImage2D.size.width, this.texImage2D.size.height, 1.0));
    const layerToImage = makeMatrix4Translation(new Vector3(this.offset.x, this.offset.y, 0.0));
    this.planeToImage = makeMatrix4Concatenation(layerToImage, planeToLayer);

    const uvScale = makeMatrix3Scale(this.uvScaleFactor);
    const uvTranslation = makeMatrix3Translation(this.uvOffset);
    this.uvToTexture = makeMatrix3Concatenation(uvTranslation, uvScale);
  }
}
