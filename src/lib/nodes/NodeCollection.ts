import { Node } from "./Node";

export class NodeCollection {
  private array: Array<Node> = [];

  constructor(public parent: Node) {}

  add(node: Node): this {
    this.array.push(node);
    node.parent = this.parent;
    return this;
  }

  remove(node: Node): this {
    const index = this.array.findIndex((n) => n.uuid === node.uuid);
    if (index >= 0) {
      this.array.splice(index, 1);
      node.parent = undefined;
    }
    return this;
  }

  forEach(callbackFn: (value: Node, index: number, array: Node[]) => void): void {
    this.array.forEach(callbackFn);
  }

  get length(): number {
    return this.array.length;
  }
}
