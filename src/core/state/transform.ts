import { OP } from './ops/OP.ts';
import { MagickState } from './index.ts';
import { AddLayerOP } from './ops/AddLayer.ts';
import { nanoid } from 'nanoid';
import { AddSharpOp } from './ops/AddSharp.ts';

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

  addLayer(index: number, attrs: Record<string, any> = {}, name?: string, id?: string) {
    const op = new AddLayerOP(index, attrs, name, id);
    this.ops.push(op);
    const newState = op.apply(this.state);
    this.states.push(newState);
    this.state = newState;
    return this;
  }

  removeLayer() {
    return this;
  }

  changeLayer() {
    return this;
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
    this.ops.push(op);
    const newState = op.apply(this.state);
    this.states.push(newState);
    this.state = newState;
    return this;
  }

  removeShape() {
    return this;
  }
  changeShape() {
    return this;
  }
}
