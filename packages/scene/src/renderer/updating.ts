import {
  Box3,
  box3ExpandByBox3,
  mat4Compose,
  mat4Inverse,
  mat4Multiply,
  mat4TransformBox3,
  positionAttributeToBoundingBox
} from '@threeify/core';

import { MeshNode } from '../scene/Mesh';
import { SceneNode } from '../scene/SceneNode';
import { SceneCache } from './SceneCache';

export function updateNodeTree(node: SceneNode, sceneCache: SceneCache) {
  nodeVisitor(node, undefined, sceneCache);
}

export function nodeVisitor(
  node: SceneNode,
  parentNode: SceneNode | undefined = undefined,
  sceneCache: SceneCache
) {
  const nodeIdToUpdateVersion = sceneCache.nodeIdToUpdateVersion;

  preOrderUpdateNode(node, parentNode, sceneCache);

  for (const child of node.children) {
    nodeVisitor(child, node, sceneCache);
  }

  postOrderUpdateNode(node, sceneCache);

  nodeIdToUpdateVersion.set(node.id, node.version);
}

export function postOrderUpdateNode(node: SceneNode, sceneCache: SceneCache) {
  const nodeIdToUpdateVersion = sceneCache.nodeIdToUpdateVersion;
  if ((nodeIdToUpdateVersion.get(node.id) || -2) === node.version) return;

  // calculate subtree bounding box
  node.subTreeBoundingBox.copy(node.nodeBoundingBox);
  const tempBox = new Box3();
  node.children.forEach((child) => {
    box3ExpandByBox3(
      mat4TransformBox3(
        child.localToParentMatrix,
        child.subTreeBoundingBox,
        tempBox
      ),
      node.subTreeBoundingBox,
      node.subTreeBoundingBox
    );
  });
}

export function preOrderUpdateNode(
  node: SceneNode,
  parentNode: SceneNode | undefined,
  sceneCache: SceneCache
) {
  const nodeIdToUpdateVersion = sceneCache.nodeIdToUpdateVersion;
  if ((nodeIdToUpdateVersion.get(node.id) || -2) === node.version) return;

  node.parent = parentNode;

  // update local to parent matrices
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

  // node-only bounding box
  if (node instanceof MeshNode) {
    const meshNode = node as MeshNode;
    node.nodeBoundingBox = positionAttributeToBoundingBox(
      meshNode.geometry.attributes.position,
      node.nodeBoundingBox
    );
  } else {
    node.nodeBoundingBox = new Box3();
  }
}
