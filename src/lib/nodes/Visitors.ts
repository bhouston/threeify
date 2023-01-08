import { Node } from './Node';

// visitors

export function depthFirstVisitor(
  node: Node,
  callback: (node: Node) => void
): void {
  node.children.forEach((child) => {
    depthFirstVisitor(child, callback);
  });
  callback(node);
}

export function rootLastVisitor(
  node: Node,
  callback: (node: Node) => void
): void {
  callback(node);
  if (node.parent !== undefined) {
    rootLastVisitor(node.parent, callback);
  }
}

export function rootFirstVisitor(
  node: Node,
  callback: (node: Node) => void
): void {
  if (node.parent !== undefined) {
    rootFirstVisitor(node.parent, callback);
  }
  callback(node);
}
