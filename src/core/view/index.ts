import { MagickState } from '../state';
import Konva from 'konva';
import { Transform } from '../state/transform.ts';
import { VNode } from '../state/VNode.ts';
import Group = Konva.Group;
import { KonvaTypes } from './types.ts';
import { applyNodeProps } from './makeUpdates.ts';

type Commit = { type: string; node: VNode; old?: VNode; beforeIndex?: number; afterIndex?: number };
export class MagickView {
  dom: HTMLDivElement;
  state!: MagickState;
  root!: Konva.Stage;

  constructor(
    dom: HTMLDivElement,
    options: { state?: MagickState; dispatch?: (tr: Transform) => MagickState },
  ) {
    this.dom = dom;
    // const rootID = nanoid();
    // this.state = new MagickState(new VNode('stage', {}, [], null, rootID));
    // this.state = this.state.apply(new Transform(this.state).addLayer(0, {}, '图层1'));
    options.state && this.setState(options.state);
    options.dispatch && (this.dispatch = options.dispatch!.bind(this));
  }

  get rootId() {
    return this.state!.root.id;
  }

  setState(state: MagickState) {
    const commitList: Commit[] = [];
    const oldState = this.state;
    console.log('oldState', oldState);
    if (!oldState) {
      commitList.push({ type: 'appendChild', node: state.root, old: undefined });
    } else {
      const newNodes: VNode[] = [state.root];
      const oldNodes: VNode[] = [oldState.root];
      while (newNodes.length > 0) {
        const newNode = newNodes.shift()!;
        const oldNode = oldNodes.length > 0 ? oldNodes.shift() : null;

        // 如果新旧节点的 id 相同，那么我们可以跳过对它们子节点的处理
        if (newNode === oldNode) {
          continue;
        }

        // 如果旧节点不存在，说明是新添加的节点
        if (!oldNode) {
          // 在这里添加对新节点的添加操作
          commitList.push({ type: 'appendChild', node: newNode, old: undefined });
          continue;
        }

        if (newNode.id !== oldNode.id || newNode.type !== oldNode.type) {
          // 如果新旧节点的 id 不同，那么我们需要对新节点进行添加操作, 并删除旧节点
          commitList.push({ type: 'deleteChild', node: oldNode });
          commitList.push({ type: 'appendChild', node: newNode });
          continue;
        }

        if (newNode.attrs !== oldNode.attrs) {
          commitList.push({ type: 'updateAttrs', node: newNode, old: oldNode });
        }

        if (newNode.children !== oldNode.children) {
          // 使用双端对齐的方式来比较子节点
          let start = 0;
          let endNew = newNode.children.size - 1;
          let endOld = oldNode.children.size - 1;

          // 从头部开始比较
          while (
            start <= endNew &&
            start <= endOld &&
            newNode.children.get(start) === oldNode.children.get(start)
          ) {
            start++;
          }

          // 从尾部开始比较
          while (
            start <= endNew &&
            start <= endOld &&
            newNode.children.get(endNew) === oldNode.children.get(endOld)
          ) {
            endNew--;
            endOld--;
          }

          const oldIndexMap = new Map<
            string,
            {
              node: VNode;
              index: number;
            }
          >();
          for (let i = start; i <= endOld; i++) {
            const oldChildNode = oldNode.children.get(i)!;
            if (oldChildNode) {
              oldIndexMap.set(oldChildNode.id, {
                index: i,
                node: oldChildNode,
              });
            } else {
              break;
            }
          }

          for (let i = start; i <= endNew; i++) {
            const newChild = newNode.children.get(i)!;
            const oldChildIndex = oldIndexMap.get(newChild.id);
            if (oldChildIndex) {
              if (oldChildIndex.index !== i) {
                // 如果在旧节点中找到了与新节点同 ID 的子节点，执行移动操作
                commitList.push({
                  type: 'moveChild',
                  node: newChild,
                  beforeIndex: oldChildIndex.index,
                  afterIndex: i,
                });
              }
              // 当索引相同的时候，需要对比子节点
              // 当索引不同的时候，也需要对比子节点，但是不用进行移动操作
              oldIndexMap.delete(newChild.id);
              newNodes.push(newChild);
              oldNodes.push(oldChildIndex.node);
            } else {
              commitList.push({ type: 'appendChild', node: newChild });
            }
          }

          // 处理需要被删除的旧节点
          oldIndexMap.forEach((oldChild) => {
            commitList.push({ type: 'deleteChild', node: oldChild.node });
          });
        }
      }
    }
    this.commit(commitList);
    this.state = state;
  }

  private commit(commitList: Commit[]) {
    for (const commit of commitList) {
      switch (commit.type) {
        case 'appendChild':
          if (commit.node.parent) {
            const findNode = this.root.findOne(`#${commit.node.parent.id}`);
            console.error(this.root);
            console.error('findNode', findNode, commit.node, commit.node.parent.id);
            (findNode as Group).add(this.renderNode(commit.node));
          } else {
            console.error('初始化', commit.node, this.root);
            this.root && this.root.destroy();
            this.root = new Konva.Stage({
              container: this.dom,
              ...commit.node.props,
            });
            (window as any).magickView = this.root;
            for (const child of commit.node.children) {
              this.root.add(this.renderNode(child));
            }
          }
          break;
        case 'deleteChild':
          this.root.findOne(`#${commit.node.id}`)?.destroy();
          break;
        case 'updateAttrs':
          applyNodeProps(
            this.root.findOne(`#${commit.node.id}`),
            commit.node.props,
            commit.old?.props || {},
          );
          break;
        case 'moveChild':
          const parent = this.root.findOne(`#${commit.node.parent!.id}`) as Group;
          [parent.children[commit.beforeIndex!], parent.children[commit.afterIndex!]] = [
            parent.children[commit.afterIndex!],
            parent.children[commit.beforeIndex!],
          ];
          parent.draw();
          break;
      }
    }
  }

  private renderNode(node: VNode) {
    if (KonvaTypes.includes(node.type)) {
      console.error('renderNode', node, node.type, node.props);
      // @ts-ignore
      const kNode = new Konva[node.type](node.props);
      if (['Stage', 'Layer', 'Group'].includes(node.type)) {
        (kNode as Group).add(...(node.children || []).map((item) => this.renderNode(item)));
      }
      return kNode;
    } else {
      console.error('renderNode type error', node);
    }
  }

  dispatch(tr: Transform) {
    const newState = this.state.apply(tr);
    this.setState(newState);
    return newState;
  }

  destroy() {
    this.dom.remove();
  }
}
