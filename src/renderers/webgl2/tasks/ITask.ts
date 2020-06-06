//
// basic render task interface
//
// Authors:
// * @bhouston
//

import { RenderingContext } from '../RenderingContext';

export interface ITask {
	execute(context: RenderingContext): void;
}
