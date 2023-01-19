import {
  mat4Compose,
  mat4Inverse,
  mat4Multiply
} from '../../math/Mat4.Functions';
import { SceneNode } from '../scene/SceneNode';

export function updateNodeTree(
  node: SceneNode,
  parentNode: SceneNode | undefined = undefined
) {
  updateNode(node, parentNode);

  node.children.forEach((child) => {
    updateNodeTree(child, node);
  });
}

export function updateNode(node: SceneNode, parentNode: SceneNode | undefined) {
  node.parent = parentNode;

  mat4Compose(
    node.position,
    node.rotation,
    node.scale,
    node.localToParentMatrix
  );
  mat4Inverse(node.localToParentMatrix, node.parentToLocalMatrix);

  if (node.parent !== undefined) {
    mat4Multiply(
      node.localToParentMatrix,
      node.parent.localToWorldMatrix,
      node.localToWorldMatrix
    );
    mat4Inverse(node.localToWorldMatrix, node.worldToLocalMatrix);
  } else {
    node.localToWorldMatrix.copy(node.localToParentMatrix);
    node.worldToLocalMatrix.copy(node.parentToLocalMatrix);
  }
}
