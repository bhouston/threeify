//
// clear task
//
// Authors:
// * @bhouston
//

import { Attachments } from "../Attachments";
import { Color } from "../../../math/Color";
import { ITask } from "./ITask";
import { RenderingContext } from "../RenderingContext";

export class ClearTask implements ITask {
  color: Color = new Color();
  alpha = 1.0;
  attachmentFlags = Attachments.Color | Attachments.Depth;

  execute(context: RenderingContext): void {
    const gl = context.gl;
    const color = this.color;

    gl.clearColor(color.r, color.g, color.b, this.alpha); // clear to blue
    gl.clear(this.attachmentFlags);
  }
}
