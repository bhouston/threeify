import { Matrix4 } from "../../math/Matrix4";
import { makeMatrix4Concatenation, makeMatrix4Scale, makeMatrix4Translation } from "../../math/Matrix4.Functions";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
import { TexImage2D } from "../../renderers/webgl/textures/TexImage2D";
import { LayerCompositor } from "./LayerCompositor";

export class Layer {
  disposed = false;
  localToWorld: Matrix4;

  constructor(
    public compositor: LayerCompositor,
    public url: string,
    public texImage2D: TexImage2D,
    public offset: Vector2,
  ) {
    // world space is assumed to be in layer pixel space
    const localToWorldScale = makeMatrix4Scale(
      new Vector3(this.texImage2D.size.width, this.texImage2D.size.height, 1.0),
    );
    const localToWorldTranslation = makeMatrix4Translation(new Vector3(this.offset.x, this.offset.y, 0.0));
    this.localToWorld = makeMatrix4Concatenation(localToWorldTranslation, localToWorldScale);
  }
}
