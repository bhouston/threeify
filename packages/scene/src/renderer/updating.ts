import { positionAttributeToBoundingBox, primitiveCount } from '@threeify/core';
import {
  Box3,
  box3Empty,
  box3ExpandByBox3,
  mat4Compose,
  mat4Inverse,
  mat4Multiply,
  mat4TransformBox3
} from '@threeify/math';

import { MeshNode } from '../scene/Mesh';
import { SceneNode } from '../scene/SceneNode';
import { breadthFirstVisitor } from '../scene/Visitors';
import { SceneTreeCache } from './SceneTreeCache';

export function subTreeStats(node: SceneNode): {
  numPrimitives: number;
  numNodes: number;
} {
  let numPrimitives = 0;
  let numNodes = 0;
  breadthFirstVisitor(node, (node) => {
    numNodes++;
    if (node instanceof MeshNode) {
      numPrimitives += primitiveCount((node as MeshNode).geometry);
    }
  });
  return { numPrimitives, numNodes };
}

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

  /*console.group(
    node.constructor.name,
    node.name,
    nodeIdToUpdateVersion.get(node.id),
    node.version
  );*/

  const parentOrNodeChanged = preOrderUpdateNode(
    node,
    parentNode,
    parentNodeChanged,
    sceneUpdateCache
  );

  let childrenNodesChanged = false;
  node.children.forEach((child) => {
    child.parent = node;
    const childNodeChanged = nodeVisitor(
      child,
      node,
      parentOrNodeChanged,
      sceneUpdateCache
    );
    childrenNodesChanged = childrenNodesChanged || childNodeChanged;
  });

  const childOrNodeChanged = postOrderUpdateNode(
    node,
    childrenNodesChanged,
    sceneUpdateCache
  );

  nodeIdToUpdateVersion.set(node.id, node.version);

  //console.groupEnd();
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
        child.localToParent,
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

  if (!parentNodeChanged && nodeIdToUpdateVersion.get(node.id) == node.version)
    return false;

  /*console.log(
    'local transform',
    node.translation.clone(),
    node.rotation.clone(),
    node.scale.clone()
  );*/

  // update local to parent matrices
  if (nodeIdToUpdateVersion.get(node.id) !== node.version) {
    node.localToParent = mat4Compose(
      node.translation,
      node.rotation,
      node.scale,
      node.localToParent
    );
    node.parentToLocal = mat4Inverse(
      node.localToParent,
      node.parentToLocal
    );
  }

  // update local to world matrices.
  if (node.parent !== undefined) {
    // localToParentMatrix happens first, and then parent.localToWorldMatrix - this is correct
    mat4Multiply(
      node.parent.localToWorld,
      node.localToParent,
      node.localToWorld
    );
    mat4Inverse(node.localToWorld, node.worldToLocal);
  } else {
    node.localToWorld.copy(node.localToParent);
    node.worldToLocal.copy(node.parentToLocal);
  }

  /*if (node.parent !== undefined) {
    const parentLocalToWorldTransform = mat4Decompose(
      node.parent.localToWorldMatrix
    );
    console.log('parentLocalToWorldTransform', parentLocalToWorldTransform);
  }*/

  //const localToParentTransform = mat4Decompose(node.localToParentMatrix);
  //console.log('localToParentMatrix', localToParentTransform);

  // const worldTransform = mat4Decompose(node.localToWorldMatrix);
  // console.log('worldTransform', worldTransform);

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
