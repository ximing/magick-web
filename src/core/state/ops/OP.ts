import { MagickState } from '../index.ts';

export abstract class OP {
  abstract apply(state: MagickState): void;

  abstract invert(state: MagickState): void;

  abstract map(): void;

  abstract getMap(): void;

  abstract toJSON(): void;
}
