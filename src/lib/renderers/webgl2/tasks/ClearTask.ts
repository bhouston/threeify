//
// clear task
//
// Authors:
// * @bhouston
//

import { Color } from "../../../math/Color";
import { AttachmentFlags } from "../Framebuffer";
import { ITask } from "./ITask";
import { Context } from "../Context";

export class ClearTask implements ITask {
    color: Color = new Color();
    alpha: number = 1.0;
    attachmentFlags: AttachmentFlags = AttachmentFlags.Color | AttachmentFlags.Depth;

    execute( context: Context ) {

        let gl = context.gl;
        let color = this.color;

        gl.clearColor(color.r, color.g, color.b, this.alpha);   // clear to blue
        gl.clear( this.attachmentFlags );

    }
}