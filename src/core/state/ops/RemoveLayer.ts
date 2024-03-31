import { OP } from './OP.ts';
import { MagickState } from '../index.ts';

export class RemoveLayer extends OP {
  apply(state: MagickState): void {}

  getMap(): void {}

  invert(state: MagickState): void {}

  map(): void {}

  toJSON(): void {}
}
