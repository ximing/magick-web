import { Transform } from './transform.ts';
import { VNode } from './VNode.ts';

export class MagickState {
  version: number;
  root: VNode;

  isUpdate = true;
  isNodeUpdate = true;

  constructor(root: VNode, version: number = 0) {
    this.root = root;
    this.version = version;
  }

  get layers() {
    return this.root.children;
  }

  selection = {};

  apply(tr: Transform): MagickState {
    return tr.state;
  }

  appendNodeById(id: string, node: VNode) {
    const newNode = this.root.appendChildById(id, node);
    if (newNode) {
      return new MagickState(newNode, this.version);
    }
    throw new Error(`Node with id ${id} not found`);
  }

  changeAttrsById(id: string, attrs: Record<string, any>) {
    const newNode = this.root.changeAttrsById(id, attrs);
    if (newNode) {
      return new MagickState(newNode, this.version);
    }
    throw new Error(`Node with id ${id} not found`);
  }

  delAttrsById(id: string, keyPath: string[]) {
    const newNode = this.root.delAttrsById(id, keyPath);
    if (newNode) {
      return new MagickState(newNode, this.version);
    }
    throw new Error(`Node with id ${id} not found`);
  }

  toJSON() {
    return {
      version: this.version,
      root: this.root.toJSON(),
    };
  }

  static fromJSON(json: any) {
    return new MagickState(VNode.fromJSON(json.root), json.version);
  }
}
