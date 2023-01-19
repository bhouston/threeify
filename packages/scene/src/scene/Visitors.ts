import { SceneNode } from "./SceneNode";

export function depthFirstVisitor(
  node: SceneNode,
  callback: (node: SceneNode) => void
): void {
  node.children.forEach((child) => {
    depthFirstVisitor(child, callback);
  });
  callback(node);
}

export function breadthFirstVisitor(
  node: SceneNode,
  callback: (node: SceneNode) => void
): void {
  callback(node);
  node.children.forEach((child) => {
    breadthFirstVisitor(child, callback);
  });
}

export function rootLastVisitor(
  node: SceneNode,
  callback: (node: SceneNode) => void
): void {
  callback(node);
  if (node.parent !== undefined) {
    rootLastVisitor(node.parent, callback);
  }
}

export function rootFirstVisitor(
  node: SceneNode,
  callback: (node: SceneNode) => void
): void {
  if (node.parent !== undefined) {
    rootFirstVisitor(node.parent, callback);
  }
  callback(node);
}
