import { nanoid } from 'nanoid';
import { MagickState } from '../index.ts';
import { VNode } from '../VNode.ts';
import { OP } from './OP.ts';

export class AddSharpOp extends OP {
  type: string;
  index: number;
  attrs: Record<string, any>;
  id: string;
  parentId: string;

  op = 'AddSharpOp';

  constructor(
    type: string,
    attrs: Record<string, any> = {},
    parentId: string,
    index: number,
    id = nanoid(),
  ) {
    super();
    this.parentId = parentId;
    this.type = type;
    this.index = index;
    this.attrs = attrs;
    this.id = id;
  }

  apply(state: MagickState) {
    this.state = state;
    return state.appendNodeById(
      this.parentId,
      new VNode(this.type, Object.assign({ id: this.id }, this.attrs), [], this.id),
    );
  }

  // TODO 这里没处理实时协作下的情况
  invert() {
    return this.state;
  }

  map() {}

  toJSON() {
    return {
      op: this.op,
      parentId: this.parentId,
      type: this.type,
      index: this.index,
      attrs: this.attrs,
      id: this.id,
    };
  }

  static fromJSON(json: {
    parentId: string;
    type: string;
    attrs: Record<string, any>;
    index: number;
    id: string;
  }) {
    return new AddSharpOp(json.type, json.attrs, json.parentId, json.index, json.id);
  }

  getMap(): void {}
}
