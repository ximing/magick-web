import { VNode } from '../state/VNode.ts';

export class NodeView {
  node: VNode;

  constructor(node: VNode) {
    this.node = node;
  }

  render() {
    return this.node;
  }

  update(_: VNode) {}

  destory() {}
}
