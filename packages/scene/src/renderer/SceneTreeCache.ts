import { SceneNode } from '../scene/SceneNode';

export class SceneTreeCache {
  public breathFirstNodes: SceneNode[] = [];

  public nodeIdToVersion: Map<string, number> = new Map();

  public nodeIdToGeometryPositionBufferId: Map<string, string> = new Map();
  public positionBufferIdIdToVersion: Map<string, number> = new Map();
}
