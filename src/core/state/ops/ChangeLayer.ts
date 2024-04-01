import { OP } from './OP.ts';
import { MagickState } from '../index.ts';

export class ChangeLayer extends OP {
  id: string;
  attrs: Record<string, any> = {};

  op = 'ChangeLayer';

  constructor(id: string, attrs: Record<string, any> = {}) {
    super();
    this.id = id;
    this.attrs = attrs;
  }

  apply(state: MagickState) {
    this.state = state;
    return state.changeAttrsById(this.id, this.attrs);
  }

  getMap(): void {}

  invert(state: MagickState) {
    return state;
  }

  map(): void {}

  toJSON() {
    return {
      op: this.op,
      attrs: this.attrs,
      id: this.id,
    };
  }

  static fromJSON(json: { id: string; attrs: Record<string, any> }) {
    return new ChangeLayer(json.id, json.attrs);
  }
}
