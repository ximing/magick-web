import { MagickState } from '../index.ts';

export abstract class OP {
  state!: MagickState;

  abstract apply(state: MagickState): MagickState;

  abstract invert(state: MagickState): MagickState;

  abstract map(): void;

  abstract getMap(): void;

  abstract toJSON(): any;
}
