import { List, Map } from 'immutable';
import { nanoid } from 'nanoid';

export class VNode {
  id: string;
  type: string;
  children: List<VNode>;
  attrs: Map<string, any>;
  parent: VNode | null;

  get props() {
    return Object.assign({ id: this.id }, this.attrs.toJS());
  }

  constructor(
    type: string,
    attrs: Map<string, any> | Record<string, any> = Map({}),
    children: List<VNode> | VNode[] = List([]),
    id: string = nanoid(),
    parent: VNode | null = null,
  ) {
    this.type = type;
    if (Map.isMap(attrs)) {
      this.attrs = attrs as Map<string, any>;
    } else {
      this.attrs = Map(attrs);
    }
    this.id = id;
    if (List.isList(children)) {
      this.children = children;
    } else {
      this.children = List(children);
    }
    this.parent = parent;
  }

  findChildById(id: string): VNode | undefined {
    if (this.id === id) {
      return this;
    }
    for (let child of this.children) {
      if (child.id === id) {
        return child;
      }
      let found = child.findChildById(id);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  appendChildById(id: string, newChild: VNode): VNode | null {
    if (this.id === id) {
      newChild.parent = this;
      return new VNode(this.type, this.attrs, this.children.push(newChild), this.id, this.parent);
    }
    for (let [index, child] of this.children.entries()) {
      const newNode = child.appendChildById(id, newChild);
      if (newNode) {
        return new VNode(
          this.type,
          this.attrs,
          this.children.set(index, newNode),
          this.id,
          this.parent,
        );
      }
    }
    return null;
  }

  changeAttrsById(id: string, attrs: Record<string, any>): VNode | null {
    if (this.id === id) {
      return new VNode(this.type, this.attrs.merge(attrs), this.children, this.id, this.parent);
    }
    for (let [index, child] of this.children.entries()) {
      const updatedNode = child.changeAttrsById(id, attrs);
      if (updatedNode) {
        return new VNode(
          this.type,
          this.attrs,
          this.children.set(index, updatedNode),
          this.id,
          this.parent,
        );
      }
    }
    return null;
  }

  delAttrsById(id: string, keyPath: string[]): VNode | null {
    if (this.id === id) {
      return new VNode(
        this.type,
        this.attrs.deleteIn(keyPath),
        this.children,
        this.id,
        this.parent,
      );
    }
    for (let [index, child] of this.children.entries()) {
      const updatedNode = child.delAttrsById(id, keyPath);
      if (updatedNode) {
        return new VNode(
          this.type,
          this.attrs,
          this.children.set(index, updatedNode),
          this.id,
          this.parent,
        );
      }
    }
    return null;
  }

  toJSON(): {
    id: string;
    attrs: Record<string, any>;
    type: string;
    children: any[];
    parentId?: string;
  } {
    return {
      type: this.type,
      attrs: this.attrs.toJS(),
      id: this.id,
      children: this.children.map((child) => child.toJSON()).toJS(),
      parentId: this.parent?.id,
    };
  }

  static fromJSON(json: any, parent?: VNode) {
    const vNode = new VNode(json.type, Map(json.attrs), [], json.id, parent);
    vNode.children = List(json.children.map((child: any) => VNode.fromJSON(child, vNode)));
    return vNode;
  }
}
