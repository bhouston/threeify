import { Node } from './Node';

export function* traverse(root: Node): Generator<Node, void, void> {
  const stack = [];
  stack.push(root);
  while (stack.length > 0) {
    const node = stack.pop();
    if (node !== undefined) {
      yield node;
      node.children.forEach((childNode) => {
        stack.push(childNode);
      });
    }
  }
}

/*

  example usage:

  const iter = traverse(rootNode);
  let curr = iter.next();
  while (!curr.done) {
    console.log(classnameocurr.value.constructor.name, curr.value instanceof Light);
    curr = iter.next();
  }

*/
