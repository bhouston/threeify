//
// basic render task interface
//
// Authors:
// * @bhouston
//

import { Context } from "../Context";

export interface ITask {
    execute( context: Context ): void;
}