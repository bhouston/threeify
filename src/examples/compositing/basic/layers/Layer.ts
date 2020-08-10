import { IDisposable } from "../../../../lib/core/types";
import { Matrix4 } from "../../../../lib/math/Matrix4";
import {
  makeMatrix4Concatenation,
  makeMatrix4Scale,
  makeMatrix4Translation,
} from "../../../../lib/math/Matrix4.Functions";
import { Vector2 } from "../../../../lib/math/Vector2";
import { Vector3 } from "../../../../lib/math/Vector3";
import { TexImage2D } from "../../../../lib/renderers/webgl/textures/TexImage2D";
import { LayerRenderer } from "./LayerRenderer";

export class Layer implements IDisposable {
  disposed = false;
  localToWorld: Matrix4;

  constructor(
    public renderer: LayerRenderer,
    public url: string,
    public texImage2D: TexImage2D,
    public offset: Vector2,
    public size: Vector2,
  ) {
    // world space is assumed to be in layer pixel space
    const localToWorldScale = makeMatrix4Scale(new Vector3(this.size.width, this.size.height, 1.0));
    const localToWorldTranslation = makeMatrix4Translation(new Vector3(this.offset.x, this.offset.y, 0.5));
    this.localToWorld = makeMatrix4Concatenation(localToWorldScale, localToWorldTranslation);
  }

  dispose(): void {
    if (!this.disposed) {
      this.texImage2D.dispose();
      this.disposed = true;
      delete this.renderer.layerCache[this.url];
    }
  }
}
