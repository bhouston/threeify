import { Node } from './Node.js';

export class NodeCollection {
	private parent: Node;
	private array: Array<Node> = [];

	constructor(parent: Node) {
		this.parent = parent;
	}

	add(node: Node) {
		this.array.push(node);
		node.parent = this.parent;
		return this;
	}

	remove(node: Node) {
		let index = this.array.findIndex((n) => n.uuid === node.uuid);
		if (index >= 0) {
			this.array.splice(index, 1);
			node.parent = null;
		}
		return this;
	}

	forEach(callbackFn: (value: Node, index: number, array: Node[]) => void) {
		this.array.forEach(callbackFn);
	}

	get length() {
		return this.array.length;
	}
}
