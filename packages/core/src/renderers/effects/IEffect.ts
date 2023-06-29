import { IDisposable } from '../../core/types.js';

export interface IEffect extends IDisposable {
  exec(props: any): void;
  dispose(): void;
}
