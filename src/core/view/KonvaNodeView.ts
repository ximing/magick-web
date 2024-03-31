import { NodeView } from './NodeView.ts';
import { VNode } from '../state/VNode.ts';

export class KonvaNodeView extends NodeView {
  constructor(node: VNode) {
    super(node);
  }

  render() {
    return this.node;
  }

  update(_: VNode) {}

  destory() {}
}
