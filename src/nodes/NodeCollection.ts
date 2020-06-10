import { Group } from "./Group";

export class NodeCollection {
  private parent: Group;
  private array: Array<Group> = [];

  constructor(parent: Group) {
    this.parent = parent;
  }

  add(node: Group): this {
    this.array.push(node);
    node.parent = this.parent;
    return this;
  }

  remove(node: Group): this {
    const index = this.array.findIndex((n) => n.uuid === node.uuid);
    if (index >= 0) {
      this.array.splice(index, 1);
      node.parent = null;
    }
    return this;
  }

  forEach(callbackFn: (value: Group, index: number, array: Group[]) => void): void {
    this.array.forEach(callbackFn);
  }

  get length(): number {
    return this.array.length;
  }
}
