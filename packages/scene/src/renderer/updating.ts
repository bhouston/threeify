import {
  Box3,
  box3Empty,
  box3ExpandByBox3,
  mat4Compose,
  mat4Inverse,
  mat4Multiply,
  mat4TransformBox3,
  positionAttributeToBoundingBox
} from '@threeify/core';

import { MeshNode } from '../scene/Mesh';
import { SceneNode } from '../scene/SceneNode';
import { SceneTreeCache } from './SceneTreeCache';

export function updateNodeTree(
  node: SceneNode,
  sceneUpdateCache: SceneTreeCache
) {
  nodeVisitor(node, undefined, false, sceneUpdateCache);
}

// this is both propagating dirty flags upwards and downwards.
// I am sort of proud of this structure, my own invention.
export function nodeVisitor(
  node: SceneNode,
  parentNode: SceneNode | undefined = undefined,
  parentNodeChanged: boolean,
  sceneUpdateCache: SceneTreeCache
): boolean {
  const nodeIdToUpdateVersion = sceneUpdateCache.nodeIdToVersion;

  const parentOrNodeChanged = preOrderUpdateNode(
    node,
    parentNode,
    parentNodeChanged,
    sceneUpdateCache
  );

  let childNodeChanged = false;
  for (const child of node.children) {
    childNodeChanged =
      childNodeChanged ||
      nodeVisitor(child, node, parentOrNodeChanged, sceneUpdateCache);
  }

  const childOrNodeChanged = postOrderUpdateNode(
    node,
    childNodeChanged,
    sceneUpdateCache
  );

  nodeIdToUpdateVersion.set(node.id, node.version);

  return childOrNodeChanged;
}

export function postOrderUpdateNode(
  node: SceneNode,
  childNodeChanged: boolean,
  sceneUpdateCache: SceneTreeCache
): boolean {
  const nodeIdToUpdateVersion = sceneUpdateCache.nodeIdToVersion;

  if (!childNodeChanged && nodeIdToUpdateVersion.get(node.id) == node.version)
    return false;

  // calculate subtree bounding box
  node.subTreeBoundingBox.copy(node.nodeBoundingBox);
  const tempBox = new Box3();
  node.children.forEach((child) => {
    box3ExpandByBox3(
      node.subTreeBoundingBox,
      mat4TransformBox3(
        child.localToParentMatrix,
        child.subTreeBoundingBox,
        tempBox
      ),
      node.subTreeBoundingBox
    );
  });

  return true;
}

export function preOrderUpdateNode(
  node: SceneNode,
  parentNode: SceneNode | undefined,
  parentNodeChanged: boolean,
  sceneUpdateCache: SceneTreeCache
): boolean {
  const nodeIdToUpdateVersion = sceneUpdateCache.nodeIdToVersion;
  console.log(nodeIdToUpdateVersion.get(node.id), node.version);
  if (!parentNodeChanged && nodeIdToUpdateVersion.get(node.id) == node.version)
    return false;

  // update local to parent matrices
  if (nodeIdToUpdateVersion.get(node.id) == node.version) {
    node.localToParentMatrix = mat4Compose(
      node.translation,
      node.rotation,
      node.scale,
      node.localToParentMatrix
    );
    node.parentToLocalMatrix = mat4Inverse(
      node.localToParentMatrix,
      node.parentToLocalMatrix
    );
  }

  // update local to world matrices.
  if (node.parent !== undefined) {
    mat4Multiply(
      node.parent.localToWorldMatrix,
      node.localToParentMatrix,
      node.localToWorldMatrix
    );
    mat4Inverse(node.localToWorldMatrix, node.worldToLocalMatrix);
  } else {
    node.localToWorldMatrix.copy(node.localToParentMatrix);
    node.worldToLocalMatrix.copy(node.parentToLocalMatrix);
  }

  // node-only bounding box - convert to checking the attribute version.
  if (nodeIdToUpdateVersion.get(node.id) !== node.version) {
    if (node instanceof MeshNode) {
      const meshNode = node as MeshNode;
      node.nodeBoundingBox = positionAttributeToBoundingBox(
        meshNode.geometry.attributes.position,
        node.nodeBoundingBox
      );
    } else {
      box3Empty(node.nodeBoundingBox);
    }
  }

  return true;
}
