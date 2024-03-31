import { OP } from './OP.ts';
import { nanoid } from 'nanoid';
import { MagickState } from '../index.ts';
import { VNode } from '../VNode.ts';

export class AddLayerOP extends OP {
  name: string;
  index: number;
  id: string;
  state!: MagickState;
  attrs: Record<string, any> = {};
  constructor(index: number, attrs: Record<string, any> = {}, name?: string, id?: string) {
    super();
    this.name = name || '未命名';
    this.index = index;
    this.attrs = attrs;
    this.id = id || nanoid();
  }

  apply(state: MagickState) {
    this.state = state;
    return state.appendNodeById(
      state.root.id,
      new VNode('Layer', Object.assign({ id: this.id }, this.attrs), [], this.id),
    );
  }

  // TODO 这里没处理实时协作下的情况
  invert() {
    return this.state;
  }

  map() {}

  toJSON() {
    return {
      name: this.name,
      type: 'Layer',
      index: this.index,
      id: this.id,
      attrs: this.attrs,
    };
  }

  static fromJSON(json: { name: string; index: number; id: string; attrs: Record<string, any> }) {
    return new AddLayerOP(json.index, json.attrs, json.name, json.id);
  }

  getMap(): void {}
}
