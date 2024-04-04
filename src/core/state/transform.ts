import { OP } from './ops/OP.ts';
import { MagickState } from './index.ts';
import { AddLayerOP } from './ops/AddLayer.ts';
import { nanoid } from 'nanoid';
import { AddSharpOp } from './ops/AddSharp.ts';
import { ChangeAttrs } from './ops/ChangeAttrs.ts';

export class Transform {
  ops: OP[] = [];

  states: MagickState[] = [];

  stageChange = false;

  state: MagickState;
  before: MagickState;

  constructor(stage: MagickState) {
    this.state = stage;
    this.before = stage;
  }

  private doOPInner(op: OP) {
    this.ops.push(op);
    const newState = op.apply(this.state);
    this.states.push(newState);
    this.state = newState;
    return this;
  }

  addLayer(index: number, attrs: Record<string, any> = {}, name?: string, id?: string) {
    const op = new AddLayerOP(index, attrs, name, id);
    return this.doOPInner(op);
  }

  removeLayer() {
    return this;
  }

  changeAttrs(id: string, attrs: Record<string, any> = {}) {
    const op = new ChangeAttrs(id, attrs);
    return this.doOPInner(op);
  }

  addShape(
    type: string,
    index: number,
    attrs: Record<string, any> = {},
    parentId: string,
    id = nanoid(),
  ) {
    console.log('addShape', parentId);
    const op = new AddSharpOp(type, attrs, parentId, index, id);
    return this.doOPInner(op);
  }

  removeShape() {
    return this;
  }
  changeShape() {
    return this;
  }
}
