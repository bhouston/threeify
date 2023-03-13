import { IDisposable } from '../../core/types';

export interface IEffect extends IDisposable {
  exec(props: any): void;
  dispose(): void;
}
